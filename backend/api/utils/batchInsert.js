const { IndexTeam, IndexEvent, IndexOPR } = require('../schemas/massSchema');

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

const insertOPRs = async (teams) => {
    const batchSize = 1000;

    for (let i = 0; i < teams.length; i+= batchSize) {
        const batch = teams.slice(i, i + batchSize);
        await IndexOPR.insertMany(batch, { ordered: false });
        console.log(`Inserted ${Math.min(i + batchSize, teams.length)} / ${teams.length} teams`);
    }
}

const insertEvents = async (events) => {
    console.log("Dropping existing indexes...");

    const indexes = await IndexEvent.collection.getIndexes();
    for (const indexName in indexes) {
        if (indexName !== '_id_') {
            try {
                await IndexEvent.collection.dropIndex(indexName);
                console.log(`Dropped index: ${indexName}`);
            } catch (error) {
                console.log(`Could not drop index ${indexName}:`, error.message);
            }
        }
    }
    
    await IndexEvent.insertMany(events, { ordered: false });
    console.log(`Inserted ${events.length} events`);

    console.log("Indexing event codes and team fields...");
    
    // Create indexes - make team indexes NON-UNIQUE
    await IndexEvent.collection.createIndex({ code: 1 });
    
    console.log('Created all indexes');
}

module.exports = { insertTeams, insertEvents, insertOPRs };