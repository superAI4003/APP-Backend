import requests
import json

# Define the URL and headers
server_url = "https://codonnier.tech/parth/bookclublm/dev"
app_secret = "BookClubLm@1210#"
login_url = f"{server_url}/Service.php?Service=login&show_error=false"
auth_token=""
login_headers = {
    "Content-Type": "application/json",
    "User-Agent": app_secret,
    "App-Secret": app_secret,
    "App-Track-Version": "v1",
    "App-Device-Type": "ios",
    "App-Store-Version": "1.1",
    "App-Device-Model": "iPhone 8",
    "App-Os-Version": "iOS 11",
    "App-Store-Build-Number": "1.1"
}

# Define the payload
login_payload = {
    "email": "jignesha@yopmail.com",
    "password": "123456"
}

# Send the POST request
response = requests.post(login_url, headers=login_headers, data=json.dumps(login_payload))

# Check the response
if response.status_code == 200:
    response_body = response.json()
    auth_token = response_body['data']['auth_token']
    print(f"Auth Token: {auth_token}")
else:
    print(f"Request failed with status code {response.status_code}")



upload_headers = {
    "Content-Type": "application/json",
    "User-Agent": app_secret,
    "App-Secret": app_secret,
    "App-Track-Version": "v1",
    "App-Device-Type": "ios",
    "App-Store-Version": "1.1",
    "App-Device-Model": "iPhone 8",
    "App-Os-Version": "iOS 11",
    "App-Store-Build-Number": "1.1",
    "Auth-Token": auth_token
}
upload_podcast_url = f"{server_url}/Service.php?Service=uploadPodcast&show_error=false"

with open('media/audio1.mp3', 'rb') as audio_file, open('media/image1.jpg', 'rb') as image_file:
    # Use 'files' to send both files and form data
    files = {
        'podcast_file': audio_file,  # File field
        'podcast_image': image_file, # File field
    }
    
    # Use 'data' to send form fields
    data = {
        'podcast_name': 'name',  
        'category_id': '1',      
        'auther': 'utsav bhaio', 
        'length_in_sec': '120',  
        'podcast_description': 'test',
    }
    
    # Remove 'Content-Type' from headers
    upload_headers.pop('Content-Type', None)
    
    response = requests.post(upload_podcast_url, headers=upload_headers, data=data, files=files)
    print(response.json())
    if response.status_code == 200:
        print("Podcast uploaded successfully.")
    else:
        print(f"Upload failed with status code {response.status_code}")