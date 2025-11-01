
import { useData } from "../contexts/DataContext";
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';

export const useAdminEventExtraction = () => {
    const { setLoading, setLoadingStatus, teamList } = useData();
    const massEventExtraction = async () => {
        if (teamList.length === 0) {
            console.warn("Team list needed for event extraction.");
            return;
        }

        let events = [];
        setLoading(true);
        setLoadingStatus("Starting mass event extraction...");
        try {
            // TODO - Change this to update instead of clear
            console.log("Clearing event list...");
            await clearAllEvents();
            console.log("Done clearing all events!");
            console.log("Getting all events...");
            let allEvents = await getEvents();
            events = allEvents.events;
            console.log(JSON.stringify(events));
            console.log("Done getting all events!");

            console.log("Inserting teams into event team listings...");
            let i = 0;
            for (const event of events) {
                i += 1;
                console.log(`Getting team listings for event: ${event.code}... ${i}/${events.length}`);
                const eventData = await getEventTeamListings(event.code);
                console.log(`Got team listings for event: ${event.code}!`);
                console.log(JSON.stringify(eventData));
                const teams = [];
                for (const team of eventData.teams) {
                    const newTeam = {
                        number: team.teamNumber,
                        name: team.nameShort,
                        location: team.displayLocation
                    }
                    teams.push(newTeam);
                }
                event.teams = teams;
                console.log(`Done processing team listings for event: ${event.code} ${i}/${events.length}!`);
            }

            console.log("Inserting events into database...");
            await insertEvents(events);
            console.log("Done inserting events into database!");
        } catch (error) {
            console.error("Error fetching event data:", error);
        } finally {
            setLoading(false);
        }
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

    const getEventTeamListings = async (eventId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
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
            console.error("Error fetching event team listings:", error);
            throw error;
        }
    }

    const insertEvents = async (events) => {
        try {
            const response = await fetch(`${API_BASE_URL}/allevents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events }),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to insert teams: ${response.status} - ${text}`);
            }
            
            const result = await response.json();
            console.log('Insert result:', result);
            return result;
        } catch (error) {
            console.error("Error inserting events:", error);
            throw error;
        }
    }

    const clearAllEvents = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/allevents`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to clear events: ${response.status} - ${text}`);
            }
            console.log('All events cleared successfully');
        } catch (error) {
            console.error("Error clearing events:", error);
            throw error;    
        }
    }
    return { massEventExtraction };
}