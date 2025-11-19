const year = 2025;
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';

export const getRegionOPR = async (region) => {
    const query = `
        query TeamsSearch($region: RegionOption, $season: Int!) {
            teamsSearch(region: $region) {
                quickStats(season: $year) {
                    season
                    number
                    tot {
                        value
                        rank
                    }
                    auto {
                        value
                        rank
                    }
                    dc {
                        value
                        rank
                    }
                    eg {
                        value
                        rank
                    }
                    count
                }
            }
        }
    `;

    const variables = {
        region: region,
        year: year
    };

    const url = `https://api.ftcscout.org/graphql`;
    
    try {
        console.log(`Fetching OPR data for region ${region} in year ${year}...`);
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                // Some GraphQL APIs may require additional headers
                // "Accept": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        console.log("done response");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check for GraphQL errors
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            return null;
        }
        
        return data.data;
        
    } catch (error) {
        console.error("Error fetching OPR data:", error);
        return null;
    }
}

export const getTeamOPR = async (teamNum) => {
    const query = `
        query GetTeamStats($teamNum: Int!, $year: Int!) {
            teamByNumber(number: $teamNum) {
                number
                quickStats(season: $year) {
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
            }
        }
    `;

    const variables = {
        teamNum: parseInt(teamNum),
        year: year
    };

    const url = `https://api.ftcscout.org/graphql`;
    
    try {
        console.log(`Fetching OPR data for team ${teamNum} in year ${year}...`);
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                // Some GraphQL APIs may require additional headers
                // "Accept": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        console.log("done response");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check for GraphQL errors
        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            return null;
        }
        
        return data.data;
        
    } catch (error) {
        console.error("Error fetching OPR data:", error);
        return null;
    }
}