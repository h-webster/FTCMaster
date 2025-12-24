const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://ftcmasterbackend.vercel.app/api"
    : "http://localhost:5000/api";

// % RANGE (0–10%)
let MIN_PERCENT = 0;
const RANGE = 10;
let MAX_PERCENT = 10;

export default async function handler(req, res) {
  try {
    // random chance gate (optional)
    console.log("Getting all events from mongodb...");
    let mongoEventList = await makeRequest("eventlist");
    console.log("Got events from mongo!");
    // get all events
    console.log("Getting all events...");
    let allEvents = await getEvents();
    const events = allEvents.events;
    console.log("Done getting all events!");
    
    MIN_PERCENT = Math.floor(Math.random() * (100 - (RANGE+1)));
    MAX_PERCENT = MIN_PERCENT + RANGE;    
    // deterministic slicing
    const start = Math.floor((MIN_PERCENT / 100) * events.length);
    const end = Math.floor((MAX_PERCENT / 100) * events.length);
    const subset = events.slice(start, end);
    

    console.log("GETTING events from " + start + "-" + end);
    let i = -1;
    for (const event of subset) {
        i += 1;
        //if event is done then skip
        const mongoEvent = mongoEventList.find(e => e.code === event.code);

        //console.log(mongoEvent);
        if (mongoEvent.done) {
            console.log("Already done so skip!");
            subset[i] = JSON.parse(JSON.stringify(mongoEvent));
            //console.log("Event: "+ JSON.stringify(event));
            continue;
        }
         
        event.done = false;
        console.log(`Getting team listings for event: ${event.code}... ${i}/${subset.length}`);
        const eventListingsData = await getEventTeamListings(event.code);
        //console.log("Event Listings Data: " + JSON.stringify(eventListingsData));
        console.log("Got team listings for event: " + event.code);
        const teams = [];
        for (const team of eventListingsData.teams) {
            const newTeam = {
                number: team.teamNumber,
                name: team.nameShort,
                location: team.displayLocation,
                rookieYear: team.rookieYear
            }
            teams.push(newTeam);
        }
        event.teams = teams;
        console.log(`Done processing team listings for event: ${event.code} ${i}/${subset.length}!`);


        // skip getting rankings, qual scores, playoff scores, and matches
        // and if datestart minus 1 day is not passed then don't get
        const now = new Date();

        const startDate = new Date(event.dateStart);
        const dayBefore = new Date(startDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        if (now < dayBefore) {
            console.log("Hasn't started yet skipping");
            event.rankings = [];
            event.qualScores = [];
            event.playoffScores = [];
            event.matches = [];
            continue;
        }

        console.log(`Getting team rankings for event: ${event.code}... ${i}/${subset.length}`);
        const eventData = await getEventRankings(event.code);
        console.log(`Got team rankings for event: ${event.code}!`);
        //console.log(JSON.stringify(eventData));
        const rankings = [];
        for (const team of eventData.rankings) {
            const newTeam = {
                number: team.teamNumber,
                name: team.teamName,
                rank: team.rank,
                wins: team.wins,
                losses: team.losses,
                ties: team.ties,
                rankScore: team.sortOrder1,
                tieBreaker: team.sortOrder2,
                npMax: team.sortOrder4,
                played: team.matchesPlayed
            }
            rankings.push(newTeam);
        }
        event.rankings = rankings;
        console.log(`Done processing team rankings for event: ${event.code} ${i}/${subset.length}!`);
        
        console.log(`Getting qualification scores for event: ${event.code}... ${i}/${subset.length}`);
        const qualScoresData = await getEventScores(event.code, "qual");
        //console.log("Qualification Scores Data: " + JSON.stringify(qualScoresData));
        console.log("Got qual scores for event: " + event.code);
        // no need for further processing, just assign (schema is the same)
        event.qualScores = qualScoresData.matchScores;

        console.log(`Getting playoff scores for event: ${event.code}... ${i}/${subset.length}`);
        const playoffScoresData = await makeRequest(`scores/${event.code}/playoff`);
        //console.log("Playoff Scores Data: " + JSON.stringify(playoffScoresData));
        console.log("Got playoff scores for event: " + event.code);
        // no need for further processing, just assign (schema is the same)
        event.playoffScores = playoffScoresData.matchScores;
        
        console.log(`Getting matches for event: ${event.code}... ${i}/${subset.length}`);
        const matchesData = await makeRequest(`matches/${event.code}`);
        //console.log("Matches Data: " + JSON.stringify(matchesData));
        console.log("Got matches for event: " + event.code);
        const matches = [];
        for (const match of matchesData.matches) {
            const newMatch = {
                tournamentLevel: match.tournamentLevel,
                series: match.series,
                matchNumber: match.matchNumber,
                scoreRedFinal: match.scoreRedFinal,
                scoreBlueFinal: match.scoreBlueFinal,
                scoreRedFoul: match.scoreRedFoul,
                scoreBlueFoul: match.scoreBlueFoul,
                scoreRedAuto: match.scoreRedAuto,
                scoreBlueAuto: match.scoreBlueAuto,
                teams: match.teams
            }
            matches.push(newMatch);
        }
        event.matches = matches;
        console.log(`Done processing matches for event: ${event.code} ${i}/${subset.length}!`);
        //console.log("SENDING: " + JSON.stringify(event));
        const endDate = new Date(event.dateEnd);
        const dayAfter = new Date(endDate);
        dayAfter.setDate(dayAfter.getDate() - 1);
        if (now > dayAfter) {
            console.log("Event is for sure done!");
            event.done = true;
        }


    }

    const batches = chunk(subset, 10);

    for (const batch of batches) {
        await fetch(`${API_BASE_URL}/allevents`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events: batch }),
        });
    }

    return res.status(200).json({
      success: true,
      processed: subset.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "cron failed" });
  }
}
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size));

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

const makeRequest = async (url) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${url}`);
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
        console.error("Error making request:", error);
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


const getEventRankings = async (eventCode) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rankings/${eventCode}`);
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

const getEventMatches = async (eventCode) => {
    try {
        const response = await fetch(`${API_BASE_URL}/matches/${eventCode}`);
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

const getEventScores = async (eventCode, level) => {
    try {
        const response = await fetch(`${API_BASE_URL}/scores/${eventCode}/${level}`);
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

