const mongoose = require('mongoose');

const indexTeamSchema = new mongoose.Schema({
    name: {type: String, required: true },
    number: {type: Number, required: true, unique: true },
    location: {type: String, default: 'Unknown'},
    rookieYear: {type: Number, default: -1}
});
 
const indexEventSchema = new mongoose.Schema({
    name: {type: String},
    code: {type: String},
    typeName: {type: String,  default: 'Unknown' },
    dateStart: {type: String,  default: 'Unknown' },
    dateEnd: {type: String,  default: 'Unknown' },
    venue: {type:String,  default: 'Unknown'},
    city: {type:String, default: 'Unknown'},
    stateprov: {type:String, default: 'Unknown'},
    country: {type:String, default: 'Unknown'},
    teams: { type: [indexTeamSchema], default: [] },
    rankings: { type: [indexRankingSchema], default: [] }
});

const indexRankingSchema = new mongoose.Schema({
    rank: {type: Number, required: true },
    number: {type: Number, required: true },
    wins: {type: Number, required: true },
    losses: {type: Number, required: true },
    ties: {type: Number, required: true },
    rankScore: {type: Number, required: true }, // sort order 1
    tieBreaker: {type: Number, required: true }, // sort order 2 (Tie breaker score)
    npMax: {type: Number, required: true }, // sort order 4 (Non-penalty max score) i think
    played: {type: Number, required: true }
});

const IndexTeam = mongoose.model('AllTeams', indexTeamSchema);
const IndexEvent = mongoose.model('AllEvents', indexEventSchema);
const IndexRanking = mongoose.model('AllRankings', indexRankingSchema);

module.exports = {
    IndexTeam,
    IndexEvent,
    indexEventSchema,
    indexTeamSchema
};