// app.js

// IMDb code
const test = [];
const apiKey = ''; // Your IMDb API key here

async function getMovieDetails(apiKey, searchQuery) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie`;
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        const response = await fetch(`${searchUrl}?api_key=${apiKey}&query=${searchQuery}`);

        if (response.ok) {
            const data = await response.json();
            const results = data.results;

            if (results.length > 0) {
                const firstResult = results[0];
                const movieDetails = {
                    title: firstResult.title,
                    overview: firstResult.overview,
                    releaseDate: firstResult.release_date,
                };

                const genreIds = firstResult.genre_ids;
                const genresResponse = await fetch(genresUrl);
                const genresData = await genresResponse.json();
                const genreNames = genresData.genres
                    .filter(genre => genreIds.includes(genre.id))
                    .map(genre => genre.name);

                movieDetails.genres = genreNames;
                return movieDetails;
            } else {
                return `No results found for the movie title: ${searchQuery}`;
            }
        } else {
            return `Error: Unable to perform movie search. Status Code: ${response.status}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}
// Spotify code
const clientId = '';
const clientSecret = '';

// ... (existing code)

// Update the getToken function
async function getToken() {
    const authString = `${clientId}:${clientSecret}`;
    const authBase64 = btoa(authString);  // Use btoa for base64 encoding in the browser

    const url = 'https://accounts.spotify.com/api/token';
    const headers = {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = { 'grant_type': 'client_credentials' };

    try {
        const response = await fetch(url, { method: 'POST', headers, body: new URLSearchParams(data) });
        const jsonResult = await response.json();
        return jsonResult.access_token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

// ... (remaining code)

function getAuthHeader(token) {
    return { 'Authorization': `Bearer ${token}` };
}

async function getSongByGenres(token, genresList) {
    if (!genresList || genresList.length === 0) {
        return 'No genres available';
    }

    // Convert genre names to lowercase
    const lowercaseGenres = genresList.map(genre => genre.toLowerCase());

    const baseUrl = 'https://api.spotify.com/v1/recommendations';
    const seedGenres = lowercaseGenres.join(',');

    const url = `${baseUrl}?seed_genres=${seedGenres}`;
    const headers = getAuthHeader(token);

    try {
        const response = await fetch(url, { headers });
        const { tracks } = await response.json();
        return tracks;
    } catch (error) {
        console.error('Error fetching songs from Spotify:', error);
        return 'Error fetching songs from Spotify';
    }
}



// Function to handle search
// Function to handle search
async function handleSearch() {
    const apiKey = '8d13eb941850b40a5045c5a7a4058cc1';  // Replace with your IMDb API key
    const movieInput = document.getElementById('movieInput').value;

    // Clear the existing content in resultsDiv
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // Call the getMovieDetails function with user input
    const movieDetails = await getMovieDetails(apiKey, movieInput);

    // Extract and display only the selected movie information
    if (movieDetails && movieDetails.title) {
        resultsDiv.innerHTML += `<strong>Title:</strong> ${movieDetails.title}<br>`;
    } else {
        resultsDiv.innerHTML = `No results found for the movie title: ${movieInput}`;
    }

    // Extract genres from movieDetails
    const genres = movieDetails.genres;

    // Call the Spotify API with the extracted genres
    const token = await getToken();
    const songs = await getSongByGenres(token, genres);

    // Extract and display only the song names
    const songNames = songs.map(song => song.name);
    resultsDiv.innerHTML += `<br><strong>Song Names:</strong><br>${songNames.join('<br>')}`;
}

// Add an event listener to the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);
