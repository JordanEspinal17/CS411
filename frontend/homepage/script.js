function searchMovies(event) {
    event.preventDefault(); // Prevent form submission

    // Get the input value from the search bar
    const searchQuery = document.getElementById('searchInput').value;

    // Display the results in the playlist section
    const playlistResults = document.getElementById('playlistResults');
    playlistResults.innerHTML = ''; // Clear previous results

    // Iterate through search results and create playlist elements
    searchResults.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.textContent = movie;
      playlistResults.appendChild(listItem);
    });
  }