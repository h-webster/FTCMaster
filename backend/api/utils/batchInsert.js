const { IndexTeam } = require('../schemas/mongoSchema');

const insertTeams = async (teams) => {
    const batchSize = 1000;

    for (let i = 0; i < teams.length; i+= batchSize) {
        const batch = teams.slice(i, i + batchSize);
        await IndexTeam.insertMany(batch, { ordered: false });
        console.log(`Inserted ${Math.min(i + batchSize, teams.length)} / ${teams.length} teams`);
    }
}

module.exports = { insertTeams };