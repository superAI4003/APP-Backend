import React, {  useContext } from 'react';
import { Context } from '../../ContextProvider';

function TitleFileUpload({ setIsUploaded }: { setIsUploaded: (uploaded: boolean) => void }) {
    // const [titles, setTitles] = useState<string[] | null>(null);
    const { setTitles } = useContext(Context)!;    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                const lines = (text as string)
                    .split('\n') // Split content by rows
                    .filter(line => line.trim() !== ''); // Remove empty or space-only lines
                setTitles(lines); // Save as an array
                setIsUploaded(true);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex justify-center items-center h-32 w-full     border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
            <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
            />
            <label htmlFor="file-upload" className="text-center text-gray-500 cursor-pointer text-lg hover:font-bold">
                Click to upload a titles file.
            </label>
        </div>
    );
}

export default TitleFileUpload;