import { useData } from "../contexts/DataContext";
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';

export const useAdminExtraction = () => {
    const { setLoading } = useData();

    const massTeamExtraction = async () => {
        const teams = [];
        setLoading(true);
        try {
            // TODO - Change this to update instead of clear
            console.log("Clearing team list...");
            await clearAllTeams();
            console.log("Done clearing all teams!");

            console.log("Getting first team page...");
            let firstTry = await getTeam(1);
            const pages = firstTry.pageTotal;
            console.log(`Received first team data! There are ${pages} pages`);
            console.log("Extracting team data from response...");
            let pageTeams = extractTeamData(firstTry.teams);
            teams.push(...pageTeams);
            console.log("Done extracting first team data from response!");

            console.log("Starting mass api call...");
            for (let i = 2; i < pages; i++) {
                console.log(`Getting page ${i}/${pages}...`);
                const teamList = await getTeam(i);
                console.log(`Got page ${i}/${pages}! Starting team extraction...`);
                pageTeams = extractTeamData(teamList.teams);
                teams.push(...pageTeams);
                console.log(`Done extracting page ${i}/${pages}!`);
            }
            console.log("Done mass api call!");

            console.log("Inserting teams into DB...");
            await insertTeamsToDB(teams);
            console.log("Done inserting teams to DB! DONE MASS TEAM EXTRACTION!");
        } catch (error) {
            console.error("Error fetching team data:", error);
        } finally {
            setLoading(false);
        }
    }

    const extractTeamData = (page) => {
        const teams = [];
        for (const team of page) {
            const newTeam = {
                number: team.teamNumber,
                name: team.nameShort,
                location: team.displayLocation
            };
            teams.push(newTeam);
        }
        return teams;
    }

    const clearAllTeams = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/allteams`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to delete teams: ${response.status} - ${text}`);
            }
            
            const result = await response.json();
            console.log(`Deleted ${result.deletedCount} teams`);
            return result;
        } catch (error) {
            console.error('Error clearing teams:', error);
            throw error;
        }
    }

    const insertTeamsToDB = async (teams) => {
        try {
            const response = await fetch(`${API_BASE_URL}/allteams`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teams })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to insert teams: ${response.status} - ${text}`);
            }
            
            const result = await response.json();
            console.log('Insert result:', result);
            return result;
        } catch (error) {
            console.error('Error inserting teams:', error);
            throw error;
        }
    }

    return { massTeamExtraction };      
};

const getTeam = async (page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/allteams/${page}`);
        if (!response.ok) {
            // Try to read any JSON or text the server returned to give a clearer error
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
        console.error('Error fetching team data:', error);
        throw error;
    }
}