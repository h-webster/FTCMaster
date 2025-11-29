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

        if (response.status === 429) {
            throw new Error('RATE_LIMIT_EXCEEDED');
        }
        console.log("Finished request to openapi!");
        return data;
    } catch (error) {
        console.error('Error doing ai request: ', error);
        throw error;
    }
}

export const saveRequest = async (ai, teamNumber) => {
    console.log("Saving ai insight to mongo..." + JSON.stringify(ai));
    try {
        const response = await fetch(`${API_BASE_URL}/teamcache/${teamNumber}/field`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fieldName: "analysis", fieldValue: ai})
        });

        const data = await response.json();

        console.log("Saved AI REQUEST!!");
        return data;
    } catch (error) {
        console.error('Error doing save ai request: ', error);
        throw error;
    }
}

