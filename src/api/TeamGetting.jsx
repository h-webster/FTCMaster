const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';
export const useTeamGetting = () => {
    const teamExtraction = async (teamNumber) => {
        console.log(`Getting team ${teamNumber}...`);
    }

    return { teamExtraction };
}