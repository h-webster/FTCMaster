import { useData } from "../contexts/DataContext";
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5174';

export const useAdminExtraction = () => {
    const { setLoading } = useData();

    const massTeamExtraction = async () => {
        setLoading(true);
        console.log("Getting first team page...");
        try {
            let firstTry = await getTeam(1);
            console.log("Received first team data:", JSON.stringify(firstTry));
        } catch (error) {
            console.error("Error fetching team data:", error);
        }
        setLoading(false);
    }

    return { massTeamExtraction };      
};

const getTeam = async (page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/allteams/${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching team data:', error);
        throw error;
    }
}