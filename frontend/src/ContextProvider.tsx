import React, { createContext, useState, ReactNode } from 'react';

interface Conversation {
    speaker: string;
    text: string;
}

export interface ContentItem {
    title: string;
    description: string;
    author: string;
    categoryID: number;
    converScript: Conversation[];
    audioURL:string;
    imageUrl:string;
}

interface ContextType {
    titles: string[] | null;
    setTitles: React.Dispatch<React.SetStateAction<string[] | null>>;
    generatedContent: ContentItem[] | null;
    setGeneratedContent: React.Dispatch<React.SetStateAction<ContentItem[] | null>>; // Add this line
    currentIndex: number; // Add this line
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    currentProcessingIndex: number; // Add this line
    setCurrentProcessingIndex: React.Dispatch<React.SetStateAction<number>>;
 
}

export const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [titles, setTitles] = useState<string[] | null>(null);
    const [generatedContent, setGeneratedContent] = useState<ContentItem[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0); // Initialize with a number
    const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number>(0);
  
    return (
        <Context.Provider value={{ titles, setTitles, generatedContent, setGeneratedContent, currentIndex, setCurrentIndex, currentProcessingIndex, setCurrentProcessingIndex }}>
            {children}
        </Context.Provider>
    );
};