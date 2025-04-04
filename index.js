document.addEventListener("DOMContentLoaded", () => {
    // API base URL for party (event) data
    const baseUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-FTB-ET-WEB-PT/events';
   
    const partyListDiv = document.getElementById('party-list');
    const partyForm = document.getElementById('party-form');

    const state = {
      allParties: [],

    }
  
    // Fetch the parties from the API and render them
    async function getParties() {
      try {
        const response = await fetch(`${baseUrl}`);
        const parties = await response.json();
        console.log(parties)
        renderParties(parties);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    }
  
    // Render the list of parties (events) in the DOM
    function renderParties(parties) {
      partyListDiv.innerHTML = ''
      if(Array.isArray(parties)){
      parties.forEach((party) => {
        const partyDiv = document.createElement('div');
        partyDiv.classList.add('party');
  
        const partyContent = document.createElement('p');
        partyContent.innerHTML = `<strong>${party.name}</strong><br>
          Date: ${party.date}<br>
          Time: ${party.time}<br>
          Location: ${party.location}<br>
          Description: ${party.description}`;
        partyDiv.appendChild(partyContent);
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener('click', () => {
          deleteParty(party._id);
        });
        partyDiv.appendChild(deleteBtn);
  
        partyListDiv.appendChild(partyDiv);
      });
    }
  
    // Add a new party via a POST request to the API
    async function addParty(newParty) {
      try {
        await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newParty)
        });
        // Re-fetch the list after adding
        getParties();
      } catch (error) {
        console.error('Error adding party:', error);
      }
    }
  
    // Delete a party using its _id via a DELETE request to the API
    async function deleteParty(id) {
      try {
        await fetch(`${baseUrl}/${id}`, {
          method: 'DELETE'
        });
        // Re-fetch the list after deletion
        getParties();
      } catch (error) {
        console.error('Error deleting party:', error);
      }
    }
  
    // Listen for form submission to add a new party
    partyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(partyForm);
      const newParty = {
        name: formData.get('name'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        description: formData.get('description')
      };
      addParty(newParty);
      partyForm.reset();
    });
  
    // Initial fetch of party data when the page loads
    getParties();
  });