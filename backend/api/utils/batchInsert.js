const { IndexTeam, IndexEvent } = require('../schemas/massSchema');

const insertTeams = async (teams) => {
    const batchSize = 1000;

    for (let i = 0; i < teams.length; i+= batchSize) {
        const batch = teams.slice(i, i + batchSize);
        await IndexTeam.insertMany(batch, { ordered: false });
        console.log(`Inserted ${Math.min(i + batchSize, teams.length)} / ${teams.length} teams`);
    }
    console.log("Indexing team numbers...");
    try {
        await IndexTeam.collection.dropIndex('number_1');
    } catch (error) {
        // Index doesn't exist, that's fine
    }
    await IndexTeam.collection.createIndex({ number: 1 });
    console.log('Created index on team number');
}

const insertEvents = async (events) => {
    await IndexEvent.insertMany(events, { ordered: false });
    console.log(`Inserted ${events.length} events`);

    console.log("Indexing event codes...");

    try {
        await IndexEvent.collection.dropIndex('code_1');
    } catch (error) {
        // Index doesn't exist, that's fine
    }
    
    await IndexEvent.collection.createIndex({ code: 1 });
    console.log('Created index on event code');
}


module.exports = { insertTeams, insertEvents };