from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from utils.get_text import get_text_from_audio, get_text_from_video, get_text_from_image
from utils.generation_audio import generate_audio, get_voice_list, get_elevenlabs_voices_list
from utils.generation_conversation import generate_conversation,generate_category, generate_description, generate_author,select_category
import json
router = APIRouter()

#Endpoint:generate conversation from media
@router.post("/generate-conversation")
async def generate_conversation_endpoint(file: UploadFile = File(None), prompt: str = Form(...), userPrompt: str=Form(...)):
    if file:
        # Save the uploaded file
        file_location = f"./media/{file.filename}"
        #Get text from media
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        if file.content_type.startswith('image/'):
            article = get_text_from_image(file_location)
        elif file.content_type.startswith('video/'):
            article = get_text_from_video(file_location)
        elif file.content_type.startswith('audio/'):
            article = get_text_from_audio(file_location)
    else:
        article = ""

    if prompt is None:
        return JSONResponse(status_code=400, content={"error": "Prompt not found"})
    
    #generate converstion from text
    result = generate_conversation(prompt, article,userPrompt)
    return {"result": result}

#Endpoint:generate conversation from text
@router.post("/generate-conversation-by-text")
async def generate_conversation_by_text_endpoint(text: str = Form(...), prompt: str = Form(...), userPrompt: str=Form(...)):
    if prompt is None:
        return JSONResponse(status_code=400, content={"error": "Prompt not found"})
    result = generate_conversation(prompt, text,userPrompt)
    return {"result": result}

#Endpoint:Generate category from title
@router.post("/generate-category-by-title")
async def generate_category_by_title_endpoint(text: str = Form(...)): 
    result = generate_category(text)
    return {"result": result}

#Endpoint:Generate description from title
@router.post("/generate-description")
async def generate_description_endpoint(text: str = Form(...)): 
    result = generate_description(text)
    return {"result": result}

#Endpoint:Generate description from title
@router.post("/generate-author")
async def generate_author_endpoint(text: str = Form(...)): 
    result = generate_author(text)
    return {"result": result}

#Endpoint:Generate description from title
@router.post("/select-category")
async def select_category_endpoint(text: str = Form(...),categories:str =Form(...)): 
    result = select_category(text,categories)
    return {"result": result}

#Endpoint:Generate Audio from scripts
@router.post("/generate-audio")
async def generate_audio_endpoint(conversation: str = Form(...),currentSpeaker:str=Form(...), id:str=Form(...)):
    audio_file_path = generate_audio(conversation,currentSpeaker,id)
    return FileResponse("media/podcast"+id+".mp3", media_type="audio/mpeg", filename="podcast.mp3")

#Endpoint:Get google voice list
@router.post("/get-voice-list")
async def get_voice_list_endpoint():
    voice_list = get_voice_list()
    return {"voice_list": voice_list}

#Endpoint:Get 11labs voice list
@router.post("/get-elevenlabs-voice-list")
async def get_elevenlabs_voice_list_endpoint():
    voice_list = get_elevenlabs_voices_list()
    return {"voice_list": voice_list}
