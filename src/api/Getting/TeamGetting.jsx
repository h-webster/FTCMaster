const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';
export const useTeamGetting = () => {
    const teamExtraction = async (teamNumber) => {
        console.log(`Getting team ${teamNumber}...`);

        const response = await fetch(`${API_BASE_URL}/teams/${teamNumber}`);
        const data = await response.json();

        if (response.ok) {
            console.log(`Team ${teamNumber} data:`, data);
            return { teamNumber, data };
        } else {
            console.error(`Failed to get team ${teamNumber}:`, data);
            return { teamNumber, error: data.message };
        }
    }

    return { teamExtraction };
}