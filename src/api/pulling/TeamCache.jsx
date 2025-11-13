const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';

export const getTeam = async (teamNum) => {
    console.log("Getting team from teamCache...");
    try {
        const response = await fetch(`${API_BASE_URL}/teamcache/${teamNum}`);
        const data = await response.json();
        console.log("Got team!");
        return data;
    } catch (error) {
        console.error('Error fetching team data:', error);
        throw error;
    }
}

export const saveTeam = async (teamData) => {
    console.log("Saving team to teamCache...");
    try {
        const response = await fetch(`${API_BASE_URL}/teamcache`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teamData)
        });
        const data = await response.json();
        console.log("Saved team!");
        return data;
    } catch (error) {
        console.error('Error saving team data:', error);
        throw error;
    }          
}

export const clearCache = async () => {
    console.log("Clearing team cache...");
    try {
        const response = await fetch(`${API_BASE_URL}/teamcache`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log("Cleared team cache!");
        return data;
    } catch (error) {
        console.error('Error clearing team cache:', error);
        throw error;
    }
}