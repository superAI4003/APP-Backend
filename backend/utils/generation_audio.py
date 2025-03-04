import base64
import json
import vertexai
import os
import re
import requests
from google.cloud import texttospeech
from pydub import AudioSegment
from dotenv import load_dotenv 
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings, play
import glob
import time
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

# load elevenlabs and google crednetial form env file
elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
google_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

client = texttospeech.TextToSpeechClient()
elevenlabs_client = ElevenLabs(api_key=elevenlabs_api_key)

#generate audio from text using google
def synthesize_speech_google(text, speaker, index, speaker_voice_map):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    #set parameter languages and speaker name
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name=speaker_voice_map[speaker]
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )
    retry_count = 0
    delay = 2  # delay in seconds
    while True:
        try:
            #generate audio and save it
            response = client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )
            filename = f"media/audio-files/{index}_{speaker}.mp3"
            with open(filename, "wb") as out:
                out.write(response.audio_content)
            print(f'Audio content written to file "{filename}"')
            break  # If successful, break the loop
        except Exception as e:  # Catch all exceptions
            if retry_count >= 7:  # Maximum retries
                print(f"Failed synthesize_speech_google after {retry_count} retries due to: {e}")
                raise  # If maximum retries exceeded, raise the exception
            else:
                print(f"Error occurred at synthesize speech: {e}. Retrying in {delay} seconds...")
                time.sleep(delay)
                retry_count += 1
                delay *= 2  # Double the delay for exponential backoff
#generate audio from text using elevenlabs
def synthesize_speech_elevenlabs(text, speaker, index, speaker_voice_map):
    #set elevenlabs parameters to generate audio
    audio_generator = elevenlabs_client.generate(
        text=text,
        voice=Voice(
            voice_id=speaker_voice_map[speaker],
            settings=VoiceSettings(stability=0.71, similarity_boost=0.5, style=0.0, use_speaker_boost=True)
        )
    )
    #save audio generated
    filename = f"media/audio-files/{index}_{speaker}.mp3"
    with open(filename, "wb") as out:
        for chunk in audio_generator:  # Iterate over the generator
            out.write(chunk)  # Write each chunk to the file
    print(f'Audio content written to file "{filename}"')

#which tool use in generating audio.
def synthesize_speech(text, speaker, index,speaker_voice_map):
    print(speaker_voice_map)
    if speaker == "person1":
        if speaker_voice_map["style1"]:

            synthesize_speech_google(text, speaker, index,speaker_voice_map)
        else:
             
            synthesize_speech_elevenlabs(text, speaker, index,speaker_voice_map)
    else:
        if speaker_voice_map["style2"]:
            synthesize_speech_google(text, speaker, index,speaker_voice_map)
             
        else:
            synthesize_speech_elevenlabs(text, speaker, index,speaker_voice_map)
              

def natural_sort_key(filename):
    return [int(text) if text.isdigit() else text for text in re.split(r'(\d+)', filename)]
# 

def generate_audio(conversation, currentSpeaker, id):
    audio_folder = "media/audio-files"
    output_file = "media/podcast"+id+".mp3"
    files = glob.glob('media/audio-files/*')
    for f in files:
        if os.path.exists(f):  # Check if file exists
            os.remove(f)  # Remove file if it exists
    if os.path.exists(output_file):  # Check if output file exists
        os.remove(output_file) 

    if isinstance(conversation, str):
        conversation = json.loads(conversation)
        speaker_voice_map = json.loads(currentSpeaker)
    generated_count = 0  # Initialize a counter for generated files
    for index, part in enumerate(conversation):
        if isinstance(part, dict):  # Ensure part is a dictionary
            speaker = part['speaker']
            text = part['text']
            synthesize_speech(text, speaker, index, speaker_voice_map)
            generated_count += 1  # Increment the counter for each generated file
        else:
            print(f"Unexpected format for conversation part: {part}")

    merge_audios(audio_folder, output_file, generated_count)  # Pass the count to the merge function

#merge audios generated
def merge_audios(audio_folder, output_file, limit):
    combined = AudioSegment.empty()
    audio_files = sorted(
        [f for f in os.listdir(audio_folder) if f.endswith(".mp3") or f.endswith(".wav")],
        key=natural_sort_key
    )[:limit]  # Limit the files processed to the count of generated files
    for filename in audio_files:
        audio_path = os.path.join(audio_folder, filename)
        print(f"Processing: {audio_path}")
        audio = AudioSegment.from_file(audio_path)
        combined += audio
    combined.export(output_file, format="mp3")
    
    print(f"Merged audio saved as {output_file}")
    return output_file


def get_voice_list():
    voices = client.list_voices()
    # Convert the protobuf message to a serializable format
    voice_list = []
    for voice in voices.voices:
        # Only include voices that support English (en-US or en-GB)
        if any(lang.startswith('en-US') for lang in voice.language_codes):
          
            voice_list.append(voice.name)
    return voice_list
 

def get_elevenlabs_voices_list():
    response = elevenlabs_client.voices.get_all()
    # Extract only the voice ID, name, and language from each voice in the response
    voice_list = [{'voice_id': voice.voice_id, 'name': voice.name} for voice in response.voices]
    return voice_list
