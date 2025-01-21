import { useState, useContext, useEffect } from "react";
import TitleFileUpload from "../components/conotrolpanel/TitleFileUpload";
import ReactLoading from "react-loading";
import { categories, categoryNames, standardprompt } from "../data/const";
import { Context } from "../ContextProvider";
import OpenAI from "openai";
import axios from 'axios';

function ControlPanel() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("ControlPanel must be used within a ContextProvider");
  }
  const { setGeneratedContent,titles,    setCurrentProcessingIndex } = context;
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState(standardprompt);
  const [currentSpeaker, setCurrentSpeaker] = useState({
    //current state speaker
    person1: "en-US-Casual-K",
    style1: true,
    person2: "en-US-Casual-K",
    style2: true,
  });
  const [voiceList, setVoiceList] = useState([]); //save voicelist state
  const [voiceElevenLabs, setVoiceElevenLabs] = useState<
    { voice_id: string; name: string }[]
  >([]);
  const [speaker1, setSpeaker1] = useState(true); //speak1 state
  const [speaker2, setSpeaker2] = useState(true); //speak2 state

  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      try {
        // Fetch prompts
        const voiceResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-voice-list/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const voiceData = await voiceResponse.json();
        console.log(voiceData.voice_list);
        setVoiceList(voiceData.voice_list);
        // Fetch 11labs voice list
        const voiceElevenLabsResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-elevenlabs-voice-list/`,
          {
            method: "POST",
          }
        );
        const voiceElevenLabsData = await voiceElevenLabsResponse.json();
        setVoiceElevenLabs(voiceElevenLabsData.voice_list);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateImage = async(title:string)=>{
    
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    const openai = new OpenAI({apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true});

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "cover of book:"+title,
      n: 1,
      size: "1024x1024",
    });
     
    return response.data[0].url;
  }

  const generateDescription = async (title: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/generate-description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: title }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error generating description:", error);
    }
  };

  const generateAuthor = async (title: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/generate-author`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: title }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("Error generating description:", error);
    }
  };
  type Category = {
    name: string;
    id: number;
  };
  const selectCategory = async (title: string, categoryNames: string) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/select-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: title, categories: categoryNames }),
      });

      if (!response.ok) {
        throw new Error("Failed to select category");
      }
      const data = await response.json();
      const selectedCategoryName = data.result;
      const selectedCategory = categories.find(
        (cate: Category) => cate.name === selectedCategoryName
      );
      return selectedCategory ? selectedCategory.id : 0;
    } catch (error) {
      console.error("Error selecting category:", error);
    }
  };
  const generateScripts = async (title: string) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const formData = new FormData();
    formData.append("text", "podcast");
    formData.append("userPrompt", prompt || "");
    formData.set("prompt", "generate podcast about" + title);
    const response = await fetch(
      `${backendUrl}/generate-conversation-by-text`,
      {
        method: "POST",
        body: formData, // Always send formData
        headers: undefined, // No need for Content-Type header with FormData
      }
    );
    const data = await response.json();
    if (data.error) {
      console.error(data.error);
    } else {
      return data.result;
    }
  };

  const generateAudio=async(script:any)=>{
    const formData = new FormData();
      formData.append("currentSpeaker", JSON.stringify(currentSpeaker));
      formData.append("id", "a1");
      formData.append("conversation", JSON.stringify(script));
      const response = await fetch(
        `${ import.meta.env.VITE_BACKEND_URL}/generate-audio`,
        {
          method: "POST",
          body: formData, // Always send formData
          headers: undefined, // No need for Content-Type header with FormData
        }
      );
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      return audioUrl;  
  }
  const handleGenerate = async () => {
    setIsGenerating(true);
    if (titles) {
      for (const title of titles) {
        const description = await generateDescription(title);
        const author = await generateAuthor(title);
        const categoryID = await selectCategory(title, categoryNames);
        const script = await generateScripts(title);
        const audioUrl = await generateAudio(script);
        const  imageUrl =  await generateImage(title);

        console.log(audioUrl);
        const newContentItem = {
          title,
          description,
          author,
          categoryID,
          converScript: script,
          audioURL: audioUrl,
          imageUrl
        };
        setGeneratedContent((prevContent: any) =>
          prevContent ? [...prevContent, newContentItem] : [newContentItem]
        ); 
        setCurrentProcessingIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
        
          return newIndex;
      });
      }
      
    }
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    try {
      const serverUrl = "https://codonnier.tech/parth/bookclublm/dev";
      const loginUrl = `${serverUrl}/Service.php?Service=login&show_error=false`;
      const appSecret = "BookClubLm@1210#";
  
      const loginHeaders = {
        "Content-Type": "application/json",
        "User-Agent": appSecret,
        "App-Secret": appSecret,
        "App-Track-Version": "v1",
        "App-Device-Type": "ios",
        "App-Store-Version": "1.1",
        "App-Device-Model": "iPhone 8",
        "App-Os-Version": "iOS 11",
        "App-Store-Build-Number": "1.1"
      };
  
      const loginPayload = {
        email: "jignesha@yopmail.com",
        password: "123456"
      };
  
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: loginHeaders,
        body: JSON.stringify(loginPayload)
      });
  
      if (response.ok) {
        const responseBody = await response.json();
        const authToken = responseBody.data.auth_token;
        console.log(`Auth Token: ${authToken}`);
        // You can now use the authToken for further requests
      } else {
        console.error(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      {isPageLoading ? (
        <p>loading</p>
      ) : (
        <div className="w-full h-full py-4 space-y-5">
          <TitleFileUpload setIsUploaded={setIsUploaded} />
          <textarea
            value={prompt}
            id= "prompt"
            name = "prompt"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here"
            className="w-full p-2 border rounded"
            rows={7}
          />
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="speaker1Checkbox"
                  className="block text-sm font-medium text-gray-700"
                >
                  Speaker1
                </label>
                <input
                  type="checkbox"
                  onChange={() => setSpeaker1(!speaker1)}
                  checked={speaker1}
                  id="speaker1Checkbox"
                  className="mr-2"
                />
              </div>
              <select
                id="Speaker1"
                name="Speaker1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setCurrentSpeaker({
                    ...currentSpeaker,
                    person1: e.target.value,
                    style1: speaker1,
                  })
                }
                value={currentSpeaker.person1}
              >
                {speaker1
                  ? voiceList.map((voice) => (
                      <option key={voice} value={voice}>
                        {voice}
                      </option>
                    ))
                  : voiceElevenLabs.map((voice) => (
                      <option key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </option>
                    ))}
              </select>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="speaker2Checkbox"
                  className="block text-sm font-medium text-gray-700"
                >
                  Speaker2
                </label>
                <input
                  type="checkbox"
                  onChange={() => setSpeaker2(!speaker2)}
                  checked={speaker2}
                  id="speaker2Checkbox"
                  className="mr-2"
                />
              </div>

              <select
                id="speaker2"
                name="speaker2"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setCurrentSpeaker({
                    ...currentSpeaker,
                    person2: e.target.value,
                    style2: speaker2,
                  })
                }
                value={currentSpeaker.person2}
              >
                {speaker2
                  ? voiceList.map((voice) => (
                      <option key={voice} value={voice}>
                        {voice}
                      </option>
                    ))
                  : voiceElevenLabs.map((voice) => (
                      <option key={voice.voice_id} value={voice.voice_id}>
                        {voice.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className=" flex items-center justify-center gap-2 bg-gray-700 w-full rounded-lg py-3 text-white hover:bg-gray-600  disabled:bg-slate-400"
            disabled={!isUploaded || isGenerating}
          >
            {isGenerating && (
              <ReactLoading
                type="spin"
                color="#000000"
                height={20}
                width={20}
              />
            )}
            Generate
          </button>
          <button
            className=" flex items-center justify-center gap-2 bg-gray-700 w-full rounded-lg py-3 text-white hover:bg-gray-600  disabled:bg-slate-400"
            
            onClick={handleSubmit}
          >
            Submmit
          </button>
        </div>
      )}
    </>
  );
}

export default ControlPanel;
