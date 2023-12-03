import spotifyapi
import requests

# I'm assuming spotifyapi.get_token() is implemented correctly and returns a valid token.
token = spotifyapi.get_token()

def create_playlist(token, user_id, song_ids):
    headers = {'Authorization': f'Bearer {token}'}

    # Create a new playlist
    playlist_data = {
        "name": "My recommendation playlist",
        "description": "Playlist created by the tutorial on developer.spotify.com",
        "public": False
    }
    playlist_response = requests.post(
        f'https://api.spotify.com/v1/users/{user_id}/playlists',
        json=playlist_data,
        headers=headers
    )
    playlist_response.raise_for_status()  # Raises an error if the response is not successful
    playlist = playlist_response.json()

    # Add tracks to the playlist
    tracks_data = {'uris': song_ids}
    add_tracks_response = requests.post(
        f"https://api.spotify.com/v1/users/{user_id}/playlists",
        json=tracks_data,
        headers=headers
    )
    add_tracks_response.raise_for_status()  # Raises an error if the response is not successful

    return playlist

# Example usage
genres = ["rock"]
songs = spotifyapi.get_song_by_genre(token, genres)
song_ids = ['spotify:track:' + song['id'] for song in songs]  # Ensure the URIs are in the correct format

# Your Spotify User ID
user_id = 'Spo Api'

# Create the playlist using the provided User ID
playlist = create_playlist(token, user_id, song_ids)
print(playlist)
