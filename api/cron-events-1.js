// ==========================================
// FILE 1: api/cron-events-1.js
// ==========================================
const API_BASE_URL = 'https://ftcmasterbackend.vercel.app/api';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await processEventRange(0, 100); // First 100 events
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in cron-events-1:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function processEventRange(startIndex, endIndex) {
  console.log(`Processing events ${startIndex} to ${endIndex}`);
  
  const mongoEventList = await makeRequest("eventlist");
  const allEvents = await getEvents();
  const events = allEvents.events.slice(startIndex, endIndex);
  
  console.log(`Processing ${events.length} events in parallel...`);
  const PARALLEL_BATCH = 10;
  const processedEvents = [];
  
  for (let i = 0; i < events.length; i += PARALLEL_BATCH) {
    const batch = events.slice(i, i + PARALLEL_BATCH);
    const results = await Promise.all(
      batch.map(async (event, idx) => {
        const globalIdx = startIndex + i + idx;
        return await processEvent(event, globalIdx, mongoEventList);
      })
    );
    processedEvents.push(...results);
    console.log(`Completed ${processedEvents.length}/${events.length}`);
  }
  
  // Upsert in batches
  const INSERT_BATCH = 10;
  for (let i = 0; i < processedEvents.length; i += INSERT_BATCH) {
    const batch = processedEvents.slice(i, i + INSERT_BATCH);
    console.log("Batch " + i);
    
    await upsertEvents(batch);
  }
  
  return {
    success: true,
    message: `Processed events ${startIndex}-${endIndex}`,
    eventsProcessed: processedEvents.length
  };
}

async function processEvent(event, index, mongoEventList) {
  console.log(`[${index}] ${event.name}`);
  
  const mongoEvent = mongoEventList.find(e => e.code === event.code);
  if (mongoEvent && mongoEvent.done) {
    console.log(`[${index}] Already done`);
    return mongoEvent;
  }
  
  event.done = false;
  
  try {
    const eventListingsData = await getEventTeamListings(event.code);
    event.teams = eventListingsData.teams.map(t => ({
      number: t.teamNumber,
      name: t.nameShort,
      location: t.displayLocation,
      rookieYear: t.rookieYear
    }));

    const now = new Date();
    const startDate = new Date(event.dateStart);
    const dayBefore = new Date(startDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    
    if (now < dayBefore) {
      event.rankings = [];
      event.qualScores = [];
      event.playoffScores = [];
      event.matches = [];
      return event;
    }

    const [eventData, qualScoresData, playoffScoresData, matchesData] = await Promise.all([
      getEventRankings(event.code),
      getEventScores(event.code, "qual"),
      makeRequest(`scores/${event.code}/playoff`),
      makeRequest(`matches/${event.code}`)
    ]);

    event.rankings = eventData.rankings.map(t => ({
      number: t.teamNumber,
      name: t.teamName,
      rank: t.rank,
      wins: t.wins,
      losses: t.losses,
      ties: t.ties,
      rankScore: t.sortOrder1,
      tieBreaker: t.sortOrder2,
      npMax: t.sortOrder4,
      played: t.matchesPlayed
    }));

    event.qualScores = qualScoresData.matchScores;
    event.playoffScores = playoffScoresData.matchScores;
    event.matches = matchesData.matches.map(m => ({
      tournamentLevel: m.tournamentLevel,
      series: m.series,
      matchNumber: m.matchNumber,
      scoreRedFinal: m.scoreRedFinal,
      scoreBlueFinal: m.scoreBlueFinal,
      scoreRedFoul: m.scoreRedFoul,
      scoreBlueFoul: m.scoreBlueFoul,
      scoreRedAuto: m.scoreRedAuto,
      scoreBlueAuto: m.scoreBlueAuto,
      teams: m.teams
    }));
    
    const endDate = new Date(event.dateEnd);
    const dayAfter = new Date(endDate);
    dayAfter.setDate(dayAfter.getDate() - 1);
    if (now > dayAfter) {
      event.done = true;
    }
    
    return event;
  } catch (error) {
    console.error(`[${index}] Error:`, error);
    event.rankings = [];
    event.qualScores = [];
    event.playoffScores = [];
    event.matches = [];
    return event;
  }
}

async function makeRequest(url) {
  const response = await fetch(`${API_BASE_URL}/${url}`);
  if (!response.ok) throw new Error(`Backend error ${response.status}`);
  return await response.json();
}

async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) throw new Error(`Backend error ${response.status}`);
  return await response.json();
}

async function getEventTeamListings(eventId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
  if (!response.ok) throw new Error(`Backend error ${response.status}`);
  return await response.json();
}

async function getEventRankings(eventCode) {
  const response = await fetch(`${API_BASE_URL}/rankings/${eventCode}`);
  if (!response.ok) throw new Error(`Backend error ${response.status}`);
  return await response.json();
}

async function getEventScores(eventCode, level) {
  const response = await fetch(`${API_BASE_URL}/scores/${eventCode}/${level}`);
  if (!response.ok) throw new Error(`Backend error ${response.status}`);
  return await response.json();
}

async function upsertEvents(events) {
  const response = await fetch(`${API_BASE_URL}/allevents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Upsert failed payload size:",
      Buffer.byteLength(JSON.stringify(events)) / 1024 / 1024, "MB"
    );
    throw new Error(`Failed to upsert: ${response.status} - ${text}`);
  }

  return await response.json();
}



// ==========================================
// FILE 2: api/cron-events-2.js
// ==========================================
// Copy entire file above, but change:
// const result = await processEventRange(100, 200); // Events 100-200


// ==========================================
// FILE 3: api/cron-events-3.js
// ==========================================
// Copy entire file above, but change:
// const result = await processEventRange(200, 300); // Events 200-300


// Add more files as needed for your total event count