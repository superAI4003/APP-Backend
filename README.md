 
### Prerequisites

- Node.js and npm (for the frontend)
- Python 3.7+ and pip (for the backend)

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory and add the following:

   ```env
   VITE_BACKEND_URL="http://127.0.0.1:8000"
   VITE_OPENAI_API_KEY= 
   ```

4. Start the development server:

   ```bash
   npm start
   ```

   The frontend will be running on `http://localhost:3000`.

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

4. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `backend` directory and add the following:

   ```env
   ELEVENLABS_API_KEY= 
   GOOGLE_APPLICATION_CREDENTIALS=D:\Current Project\credential\gcp.json
   ```

6. Start the FastAPI server:

   ```bash
   uvicorn main:app --reload
   ```

   The backend will be running on `http://localhost:8000`.

## Environment Variables

Ensure that the `.env` files are correctly set up in both the frontend and backend directories as described above. These files contain sensitive information and should not be committed to version control.

## Running the Application

Ensure both the frontend and backend servers are running. The frontend will communicate with the backend API to fetch and display data.


## How to Use

1. **Upload a Text File**: 
   - The text file should include the titles of the books you want to process.

2. **Click the Generate Button**: 
   - This will generate all content related to the book titles, including the title, description, author, podcast script, audio, and cover image.

3. **Click the Submit Button**: 
   - The generated content will be saved in the backend of the application.
