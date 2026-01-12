// get team list

const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmasterbackend.vercel.app/api' : 'http://localhost:5000/api';
export const getTeamList = async () => {
    console.log("Getting team list...");
    try {
        const response = await fetch(`${API_BASE_URL}/teamlist`);
        const data = await response.json();
        console.log("Got team list!");
        return data;
    } catch (error) {
        console.error('Error fetching team data:', error);
        throw error;
    }
}

export const getActiveTeamList = async (teamList) => {
    console.log("Getting active team list...");
    try {
        const responseOPR = await fetch(`${API_BASE_URL}/oprlist`);
        const dataOPR = await responseOPR.json();
        const oprSet = new Set(dataOPR.map(team => team.number));

        const activeList = [];
        for (const t of teamList) {
            if (oprSet.has(t.number)) {
                activeList.push(t);
            }
        }


        return activeList;
    } catch (error) {
        console.error('Error fetching active team data:', error);
        throw error;
    }
}
