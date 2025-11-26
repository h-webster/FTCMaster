const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';

export const aiRequest = async (teamData) => {
    console.log("Making request to openapi...");
    try {
        const response = await fetch(`${API_BASE_URL}/openai`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: teamData})
        });
        const data = response.json();
        console.log("Finished request to openapi!");
        return data;
    } catch (error) {
        console.error('Error saving team data: ', error);
        throw error;
    }
}

