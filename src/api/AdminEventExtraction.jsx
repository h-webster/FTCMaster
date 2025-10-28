import { get } from "express/lib/response";
import { useData } from "../contexts/DataContext";
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';

export const useAdminEventExtraction = () => {
    const massEventExtraction = async () => {
        const events = [];
        setLoading(true);
        setLoadingStatus("Starting mass event extraction...");
        try {
            // TODO - Change this to update instead of clear
            console.log("Clearing event list...");

            console.log("Done clearing all events!");

            let allEvents = await getEvents();
            console.log(JSON.stringify(allEvents));
        } catch 
    }

    const getEvents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) {
                let text;
                try {
                    text = await response.text();
                } catch (e) {
                    text = '<no response body>';
                }
                console.error(`Backend returned ${response.status}:`, text);
                throw new Error(`Backend error ${response.status}: ${text}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching events:", error);
            throw error;
        }
    }
    return { massEventExtraction };
}