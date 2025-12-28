import { getRegionOPR } from "../src/api/pulling/OPR.js";
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ftcmasterbackend.vercel.app/api"
    : "http://localhost:5000/api";

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

// % RANGE (0–10%)
let MIN_TEAM = 0;
let MAX_TEAM = 0;
const RANGE = 50;

export default async function handler(req, res) {
    MIN_TEAM = Math.floor(Math.random() * (regions.length - (RANGE + 1)));
    MAX_TEAM = MIN_TEAM + RANGE;
    // deterministic slicing
    console.log("Getting opr regions " + MIN_TEAM + "-" + MAX_TEAM);
    const subset = regions.slice(MIN_TEAM, MAX_TEAM);
    
    let teams = [];
    
    try {
        let i = -1;
        for (const region of subset) {
            i++;
            console.log("Getting region " + (i + 1) + " of " + subset.length + ": " + region);
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
                    count: team.quickStats.count,
                    endgame: team.quickStats.eg
                };
                // Check if team with this number already exists
                const teamExists = teams.some(existingTeam => existingTeam.number === newTeam.number);
                
                if (!teamExists) {
                    teams.push(newTeam);
                }
            }

            console.log("Done processing region " + region + ". Total teams so far: " + teams.length);
        }

        const batches = chunk(teams, 100);

        for (const batch of batches) {
            await fetch(`${API_BASE_URL}/oprlist`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teams: batch }),
            });
        }

        return res.status(200).json({
            success: true,
            processed: teams.length,
        });
    }    catch (error) {
        console.error("Error fetching OPR data:", error);
    }
} 

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size));


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