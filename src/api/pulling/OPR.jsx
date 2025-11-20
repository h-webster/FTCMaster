const year = 2025;
const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';

export const getOPR = async (teamNum) => {
    console.log("Getting OPR from mongo");
    try {
        const response = await fetch(`${API_BASE_URL}/oprlist/${teamNum}`);
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
        console.log("Got data!!: " + JSON.stringify(data));
        return data;
    } catch (error) {
        console.error("Error fetching OPR:", error);
        throw error;
    }
}

export const getOPRCount = async () => {
    const query = `
        query TeamsSearch($season: Int!, $number: Int!) {
            teamByNumber(number: $number) {
                quickStats(season: $season) {
                    count
                }
            }
        }
    `;

    const variables = {
        season: year,
        number: 27820
    };
    
    const data = await makeGraphQLRequest(query, variables);
    return data;
}

export const getRegionOPR = async (region) => {
    const query = `
        query TeamsSearch($region: RegionOption, $season: Int!) {
            teamsSearch(region: $region) {
                quickStats(season: $season) {
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
                }
            }
        }
    `;

    const variables = {
        region: region,
        season: year
    };

    const data = await makeGraphQLRequest(query, variables);
    return data;
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

const makeGraphQLRequest = async (query, variables) => {
    const url = `https://api.ftcscout.org/graphql`;
    
    try {
        console.log(`Sending GraphQL Request...`);
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
            const errorText = await response.text();
            console.error("Response status:", response.status);
            console.error("Response error:", errorText);
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