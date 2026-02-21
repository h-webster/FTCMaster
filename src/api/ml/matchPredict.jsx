const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ftcmaster-ml-production.up.railway.app' : 'http://localhost:8000';
import axios from "axios";
export const handlePredict = async (redTeams, blueTeams) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict`, {
            redTeams: redTeams,
            blueTeams : blueTeams
        });
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
}