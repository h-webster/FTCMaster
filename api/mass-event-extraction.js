const API_BASE_URL = 'https://ftcmasterbackend.vercel.app/api';

export default async function handler(req, res) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  } 
 // UNCOMMENT THIS SIUNDAJSDBJASDBJASHDBASJHDBASJDBASDJHABSDJASBD

  try {
    const result = await cronEventExtraction();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in mass event extraction:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// Standalone extraction function (no React dependencies)
async function cronEventExtraction() {
  let events = [];
  
  try {
    console.log("Getting all events from mongodb...");
    let mongoEventList = await makeRequest("eventlist");
    console.log("Done getting event list from mongoDB!");

    console.log("Getting all events...");
    let allEvents = await getEvents();
    events = allEvents.events;
    console.log("Done getting all events!");

    console.log("Inserting team rankings into event rankings listings...");
    let i = -1;

    for (let event of events) {
      i += 1;
      console.log("EVENT: " + event.name);
      
      // If event is done then skip
      let mongoEvent = null;
      if (i < mongoEventList.length) {
        mongoEvent = mongoEventList[i];
        console.log(mongoEvent);
        if (mongoEvent.done) {
          console.log("Already done so skip!");
          events[i] = JSON.parse(JSON.stringify(mongoEvent));
          console.log("Event: "+ JSON.stringify(event));
          continue;
        }
      }
      
      event.done = false;
      console.log(`Getting team listings for event: ${event.code}... ${i}/${events.length}`);
      const eventListingsData = await getEventTeamListings(event.code);
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
      console.log(`Done processing team listings for event: ${event.code} ${i}/${events.length}!`);

      // Skip getting rankings, qual scores, playoff scores, and matches
      // if datestart minus 1 day is not passed then don't get
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

      console.log(`Getting team rankings for event: ${event.code}... ${i}/${events.length}`);
      const eventData = await getEventRankings(event.code);
      console.log(`Got team rankings for event: ${event.code}!`);
      
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
      console.log(`Done processing team rankings for event: ${event.code} ${i}/${events.length}!`);
      
      console.log(`Getting qualification scores for event: ${event.code}... ${i}/${events.length}`);
      const qualScoresData = await getEventScores(event.code, "qual");
      console.log("Got qual scores for event: " + event.code);
      event.qualScores = qualScoresData.matchScores;

      console.log(`Getting playoff scores for event: ${event.code}... ${i}/${events.length}`);
      const playoffScoresData = await makeRequest(`scores/${event.code}/playoff`);
      console.log("Got playoff scores for event: " + event.code);
      event.playoffScores = playoffScoresData.matchScores;
      
      console.log(`Getting matches for event: ${event.code}... ${i}/${events.length}`);
      const matchesData = await makeRequest(`matches/${event.code}`);
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
      console.log(`Done processing matches for event: ${event.code} ${i}/${events.length}!`);
      
      const endDate = new Date(event.dateEnd);
      const dayAfter = new Date(endDate);
      dayAfter.setDate(dayAfter.getDate() - 1);
      if (now > dayAfter) {
        console.log("Event is for sure done!");
        event.done = true;
      }
    }
    
    console.log("Clearing event list...");
    await clearAllEvents();
    console.log("Done clearing all events!");
    console.log("Inserting events into database in batches...");
    const BATCH_SIZE = 10; // Adjust this if needed
    let totalInserted = 0;
    
    for (let i = 0; i < events.length; i += BATCH_SIZE) {
      const batch = events.slice(i, i + BATCH_SIZE);
      console.log(`Inserting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(events.length / BATCH_SIZE)} (${batch.length} events)...`);
      await insertEvents(batch);
      totalInserted += batch.length;
      console.log(`Inserted ${totalInserted}/${events.length} events so far...`);
    }
    
    console.log("Done inserting all events into database!"); 
    
    return {
      success: true,
      message: 'Mass event extraction completed',
      eventsProcessed: events.length
    };

  } catch (error) {
    console.error("Error fetching event data:", error);
    throw error;
  }
}

// Helper functions
async function makeRequest(url) {
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
  return await response.json();
}

async function getEvents() {
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
  return await response.json();
}

async function getEventTeamListings(eventId) {
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
  return await response.json();
}

async function getEventRankings(eventCode) {
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
  return await response.json();
}

async function getEventScores(eventCode, level) {
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
  return await response.json();
}

async function insertEvents(events) {
  const response = await fetch(`${API_BASE_URL}/allevents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ events }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to insert events: ${response.status} - ${text}`);
  }
  return await response.json();
}

async function clearAllEvents() {
  const response = await fetch(`${API_BASE_URL}/allevents`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to clear events: ${response.status} - ${text}`);
  }
}