from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENt_SECRET")


# print(client_id, client_secret)

def get_token():
    auth_string = client_id + ":" + client_secret #retrieve authorization token
    auth_bytes = auth_string.encode("utf-8") #Encoded
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8") #Encoded using base 64 

    url = "https://accounts.spotify.com/api/token"
    header = {
        "Authorization": "Basic " + auth_base64, 
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers=header, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

#Contructing the header
def get_auth_header (token):
    return {"Authorization": "Bearer " + token}

def search_for_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"?q={artist_name}&type=artist&limit=1" #any values you're looking for

    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]
    # print(json_result)
    if len(json_result) == 0:
        print("No artist with this name exist...")
        return None
    return json_result[0]


def get_song_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result

def  get_song_by_genre(token, seed_genres_list):
    base_url = "https://api.spotify.com/v1/recommendations"
    seed_genres = ','.join(seed_genres_list)  # Convert list of genres to comma-separated string
    url = f"{base_url}?seed_genres={seed_genres}"
    headers = get_auth_header(token)
    
    result = get(url, headers=headers)
    tracks = json.loads(result.content).get("tracks", [])
    
    return tracks





token = get_token()
# result = search_for_artist(token, "Taylor Swift")
# artist_id = result["id"]
# songs_by_artist = get_song_by_artist(token, artist_id)
# for idx, song in enumerate(songs_by_artist): #enumerate is a built-in Python function that returns both the index and the value of each item in a list (or other iterable).
#     print(f"{idx + 1}. {song['name']}")

genres = ["rock"] #case sensitive 
songs = get_song_by_genre(token, genres)
for idx, song in enumerate(songs):  # `enumerate` is a built-in Python function that returns both the index and the value of each item in a list (or other iterable).
    print(f"{idx + 1}. {song['name']}")  # This line prints the song's name with its corresponding index (starting from 1, not 0).

