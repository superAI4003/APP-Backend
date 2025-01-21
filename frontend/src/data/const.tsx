export const categories = [
    { id: 1, name: "Horror" },
    { id: 2, name: "Travel" },
    { id: 3, name: "Historical" },
    { id: 4, name: "Science" },
    { id: 5, name: "Adventure" },
    { id: 6, name: "Comedy" },
    { id: 7, name: "Business" },
    { id: 8, name: "Self-Improvement" },
    { id: 9, name: "Technology" },
    { id: 10, name: "Health & Fitness" },
    { id: 11, name: "Music" },
    { id: 12, name: "Education" },
    { id: 13, name: "Personal Journals" },
    { id: 14, name: "Fiction & Storytelling" },
    { id: 15, name: "Politics" },
    { id: 16, name: "Sports" },
    { id: 17, name: "News" },
    { id: 18, name: "Lifestyle" },
    { id: 19, name: "Philosophy" },
    { id: 20, name: "Parenting" }
];
export const categoryNames = categories.map(category => category.name).join(", ");
export const standardprompt=`As an expert podcast host, generate a captivating conversation between Jim and Marina from an article. 
The podcast is titled BookClubLM, a book recommendation system. 
First speaker is Jim and the second speaker is Marina Jim writes the articles, and Marina asks the engaging questions. 
Jim introduced himself briefly, then the subject with a short summary of the book of 60 words with two or three catchy sentences, the category of the book, and the period when the story happens.Mention the author.
Ensure the dialogue is at least 4000 words and full of emotions. 
Use short sentences for speech synthesis. Maintain excitement throughout. 
Do not mention last names or use phrases like: 'Thanks for having me, Marina!' Include filler words like well or repeat words to make it sound natural. 
Include intercalation and make the discussion colloquial. 
Conclude recommending to buy the book either online or at a favourite bookstore. 
Invite the audience to listen to the next episode of our podcast BookClubLM
`
export type CategoryType = {
    name: string;
    id: number;
};
