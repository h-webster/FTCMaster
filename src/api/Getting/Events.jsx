const API_BASE_URL = process.env.NODE_ENV === 'production' ? 'https://backend-six-sooty-74.vercel.app' : 'http://localhost:5000/api';

export const getEvents = async () => {
    console.log("Getting all events...");
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const data = await response.json();
        console.log("Got all events!");
        return data;
    } catch (error) {
        console.error('Error fetching event data:', error);
        throw error;
    }
}

export const getEventByCode = async (code) => {
    console.log(`Getting event with code: ${code}`);
    try {
        const response = await fetch(`${API_BASE_URL}/events/${code}`);
        const data = await response.json();
        console.log("Got event!");
        console.log(JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error fetching event data:', error);
        throw error;
    }
}
