import { useData } from "../contexts/DataContext";
import { getTeamOPR, getRegionOPR } from "./pulling/OPR";
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';

const regions = [
  "AU", "BR", "CAAB", "CABC", "CAON", "CAQC", "CMPIC", "CMPZ2", "CN", "CY",
  "DE", "EG", "ES", "FR", "GB", "IL", "IN", "JM", "KR", "KZ", "LY", "MX",
  "NG", "NL", "NZ", "ONADOD", "QA", "RO", "RU", "SA", "TH", "TW", "USAK",
  "USAL", "USAR", "USARL", "USAZ", "USCALA", "USCALS", "USCANO", "USCASD",
  "USCHS", "USCO", "USCT", "USDE", "USFL", "USGA", "USHI", "USIA", "USID",
  "USIL", "USIN", "USKY", "USLA", "USMA", "USMD", "USMI", "USMN", "USMOKS",
  "USMS", "USMT", "USNC", "USND", "USNE", "USNH", "USNJ", "USNM", "USNV",
  "USNYEX", "USNYLI", "USNYNY", "USOH", "USOK", "USOR", "USPA", "USRI",
  "USSC", "USTN", "USTXCE", "USTXHO", "USTXNO", "USTXSO", "USTXWP", "USUT",
  "USVA", "USVT", "USWA", "USWI", "USWV", "USWY", "ZA"
];

export const useAdminOPRExtraction = () => {
    const { setLoading, setLoadingStatus } = useData();
    const massOPRExtraction = async () => {
        setLoading(true);
        setLoadingStatus("Starting mass OPR extraction...");
        
        let teams = [];
        try {
            let i = -1;
            for (const region of regions) {
                i++;
                console.log("Getting region " + (i + 1) + " of " + regions.length + ": " + region);
                let regionOPRData = await getRegionOPR(region);
                console.log(`Region ${region} OPR data:`);
                console.log(regionOPRData);
                let teamsData = regionOPRData.teamsSearch;

                for (const team of teamsData) {
                    if (team == null || team.quickStats == null) continue;
                    const newTeam = {
                        number: team.quickStats.number,
                        tot: team.quickStats.tot,
                        auto: team.quickStats.auto,
                        teleop: team.quickStats.dc,
                        endgame: team.quickStats.eg
                    };
                    teams.push(newTeam);
                }
                console.log("Done processing region " + region + ". Total teams so far: " + teams.length);
                if (i > 2) {
                    break; // for testing purposes only fetch first 4 regions
                }
            }

            console.log("Clearing existing OPR list...");
            await makeRequest("oprlist", "DELETE");
            console.log("Done clearing OPR list!");
            console.log("Inserting opr teams into database...");
            await insertTeams(teams);
            console.log("Done inserting opr teams into database!");
        } catch (error) {
            console.error("Error fetching OPR data:", error);
        } finally {
            setLoading(false);
        }
    }

    const insertTeams = async (teams) => {
        console.log("Teams: " + JSON.stringify(teams));
        try {
            const response = await fetch(`${API_BASE_URL}/oprlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teams }),
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

    const makeRequest = async (url, method) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${url}`,  {
                method: `${method}`
            });
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
            console.error("Error fetching event scores:", error);
            throw error;
        }
    }
    return { massOPRExtraction };
}