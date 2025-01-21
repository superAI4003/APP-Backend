import { useState, useContext } from "react";
import { categories } from "../data/const";
import { Context } from "../ContextProvider";
import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from "react-icons/bs";

function ContentPanel() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("ControlPanel must be used within a ContextProvider");
  }
  const generatedContent = context?.generatedContent;
  const currentIndex = context?.currentIndex;
  const setCurrentIndex = context?.setCurrentIndex;
  const setGeneratedContent = context?.setGeneratedContent;
  const currentProcessingIndex = context.currentProcessingIndex;
  const titles = context.titles;
  const isValidIndex = generatedContent && typeof currentIndex === "number";
  const [imageLoading, setImageLoading] = useState(true);
  const handleInputChange = (field: string, value: string | number) => {
    if (isValidIndex && setGeneratedContent) {
      const updatedContent = [...generatedContent];
      updatedContent[currentIndex] = {
        ...updatedContent[currentIndex],
        [field]: value,
      };
      setGeneratedContent(updatedContent);
    }
  };
  return (
    <div className="bg-white w-full h-full rounded-3xl flex flex-col overflow-hidden">
      {/* status bar */}
      <div className="h-[60px] w-full bg-gray-200 border-gray-300 border  rounded-t-3xl flex items-center  px-10 justify-between">
        {titles &&
        currentProcessingIndex !== null &&
        currentProcessingIndex < titles.length ? (
          <p>
            {currentProcessingIndex + 1} / {titles.length} Processing{" "}
            {titles[currentProcessingIndex]}.
          </p>
        ) : (
          <p></p>
        )}
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              if (isValidIndex && setCurrentIndex) {
                setCurrentIndex(currentIndex - 1);
              }
            }}
            disabled={!isValidIndex || currentIndex === 0}
            className="text-gray-800 disabled:text-gray-500 hover:text-gray-700"
          >
            <BsArrowLeftSquareFill style={{ width: "30px", height: "30px" }} />{" "}
          </button>

          <p className="px-1">
            {isValidIndex
              ? `${currentIndex + 1}/ ${generatedContent.length}`
              : "0/0"}
          </p>
          <button
            onClick={() => {
              if (isValidIndex && setCurrentIndex) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            disabled={
              !isValidIndex || currentIndex + 1 === generatedContent.length
            }
            className="text-gray-800 disabled:text-gray-500 hover:text-gray-700"
          >
            <BsArrowRightSquareFill style={{ width: "30px", height: "30px" }} />
          </button>
        </div>
      </div>
      <div className="flex-grow flex">
        <div className="flex-1 h-full overflow-y-auto p-4 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={isValidIndex ? generatedContent[currentIndex].title : ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={
                isValidIndex ? generatedContent[currentIndex].description : ""
              }
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <input
                type="text"
                id="author"
                value={
                  isValidIndex ? generatedContent[currentIndex].author : ""
                }
                onChange={(e) => handleInputChange("author", e.target.value)}
                name="author"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={
                  isValidIndex ? generatedContent[currentIndex].categoryID : ""
                }
                onChange={(e) =>
                  handleInputChange("categoryID", Number(e.target.value))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Podcast File
            </label>
            <audio
              controls
              src={isValidIndex ? generatedContent[currentIndex].audioURL : ""}
            />
          </div>
          <div>
            {imageLoading && <p>Loading image...</p>}
            <img
              alt="image"
              src={
                isValidIndex
                  ? generatedContent[currentIndex].imageUrl
                  : "/standard.jpg"
              }
              width={350}
              height={350}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        </div>
        <div className="flex-1 h-full p-4 ">
          <div className="flex flex-col space-y-2 bg-gray-100 h-[800px] rounded-lg p-2 border border-gray-300 overflow-y-scroll">
            {isValidIndex &&
              generatedContent[currentIndex]?.converScript.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg w-[400px] ${
                      message.speaker === "person1"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200 text-black self-start"
                    }`}
                  >
                    {message.text}
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentPanel;
