const year = 2025;
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';
export const getTeamOPR = async (teamNum) => {
     const q = `
        teamByNumber(number: ${teamNum}) {
            quickStats(season: ${year}) {
                auto {
                    rank
                    value
                }
                count
                dc {
                    rank
                    value
                }
                eg {
                    rank
                    value
                }
                tot {
                    rank
                    value
                }
            }
            number
        }
    `;

    const url = `https://api.ftcscout.org/graphql`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({query: q})
        });
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Error fetching OPR data:", error);
        return null;
    }

}