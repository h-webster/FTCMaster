const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';
export const useTeamGetting = () => {
    const teamExtraction = async (teamNumber) => {
        console.log(`Getting team ${teamNumber}...`);

        // must have return what number the team data is to see if it matches with teamNumber param as multiple requests can be made at once
    }

    return { teamExtraction };
}