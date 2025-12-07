const mongoose = require('mongoose');

const indexTeamSchema = new mongoose.Schema({
    name: {type: String, required: true },
    number: {type: Number, required: true },
    location: {type: String, default: 'Unknown'},
    rookieYear: {type: Number, default: -1}
});

const indexRankingSchema = new mongoose.Schema({
    rank: {type: Number, required: true },
    number: {type: Number, required: true },
    name: {type: String, required: true},
    wins: {type: Number, required: true },
    losses: {type: Number, required: true },
    ties: {type: Number, required: true },
    rankScore: {type: Number, required: true }, // sort order 1
    tieBreaker: {type: Number, required: true }, // sort order 2 (Tie breaker score)
    npMax: {type: Number, required: true }, // sort order 4 (Auto score) i think
    played: {type: Number, required: true }
});

const indexScoresSchema = new mongoose.Schema({
    matchLevel: { type: String, required: true },
    matchSeries: { type: Number, required: true },
    matchNumber: { type: Number, required: true },
    randomization: { type: Number, required: true },
    alliances: { type: [{
        alliance: { type: String, required: true },
        team: { type: Number, required: true },
        autoClassifiedArtifacts: { type: Number, required: true },
        autoOverflowArtifacts: { type: Number, required: true },
        autoClassifierState: { type: [String], required: true },
        robot1Auto: { type: Boolean, required: true },
        robot2Auto: { type: Boolean, required: true },
        autoLeavePoints: { type: Number, required: true },
        autoArtifactPoints: { type: Number, required: true },
        autoPatternPoints: { type: Number, required: true },
        teleopClassifiedArtifacts: { type: Number, required: true },
        teleopOverflowArtifacts: { type: Number, required: true },
        teleopDepotArtifacts: { type: Number, required: true },
        teleopClassifierState: { type: [String], required: true },
        robot1Teleop: { type: String, required: true },
        robot2Teleop: { type: String, required: true },
        teleopArtifactPoints: { type: Number, required: true },
        teleopDepotPoints: { type: Number, required: true },
        teleopPatternPoints: { type: Number, required: true },
        teleopBasePoints: { type: Number, required: true },
        autoPoints: { type: Number, required: true },
        teleopPoints: { type: Number, required: true },
        foulPointsCommitted: { type: Number, required: true },
        preFoulTotal: { type: Number, required: true },
        movementRP: { type: Boolean, required: true },
        goalRP: { type: Boolean, required: true },
        patternRP: { type: Boolean, required: true },
        totalPoints: { type: Number, required: true },
        majorFouls: { type: Number, required: true },
        minorFouls: { type: Number, required: true }
    }], required: true }
});

const indexMatchesSchema = new mongoose.Schema({
    tournamentLevel: {type: String, required: true},
    series: {type: Number, required: true},
    matchNumber: {type: Number, required: true},
    scoreRedFinal: {type: Number, required: true},
    scoreBlueFinal: {type: Number, required: true},
    scoreRedFoul: {type: Number, required: true},
    scoreBlueFoul: {type: Number, required: true},
    scoreRedAuto: {type: Number, required: true},
    scoreBlueAuto: {type: Number, required: true},
    blueRP: {type: Number },
    redRP: {type: Number },
    teams: [{
        teamNumber: {type: Number, required: true},
        station: {type: String, required: true},
        dq: {type: Boolean, required: true},
        onField: {type: Boolean, required: true},
        name: {type: String, required: false}
    }],
    alliance: {type: String, required: false}
});

const indexEventSchema = new mongoose.Schema({
    name: {type: String},
    code: {type: String},
    done: {type: Boolean, default: false},
    typeName: {type: String,  default: 'Unknown' },
    dateStart: {type: String,  default: 'Unknown' },
    dateEnd: {type: String,  default: 'Unknown' },
    venue: {type:String,  default: 'Unknown'},
    city: {type:String, default: 'Unknown'},
    stateprov: {type:String, default: 'Unknown'},
    country: {type:String, default: 'Unknown'},
    teams: { type: [indexTeamSchema], default: [] },
    rankings: { type: [indexRankingSchema], default: [] },
    matches: { type: [indexMatchesSchema], default: [] },
    qualScores: { type: [indexScoresSchema], default: [] },
    playoffScores: { type: [indexScoresSchema], default: [] },
    qualMatches: {type: [indexMatchesSchema], required: false},
    playoffMatches: {type: [indexMatchesSchema], required: false},
    rp: {type: String }
});

const OPRSchema = new mongoose.Schema({
    value: {type: Number, required: true },
    rank: {type: Number, required: true }
});
const indexOPRSchema = new mongoose.Schema({
    number: {type: Number, required: true, unique: true },
    tot: {type: OPRSchema },
    auto: {type: OPRSchema },
    teleop: {type: OPRSchema },
    endgame: {type: OPRSchema },
    count: {type: Number }
});

const indexAISchema = new mongoose.Schema({
    number: {type: Number, required: true, unique: true},
    analysis: {
        score: {type: String},
        strengths: {type: [String]},
        weaknesses: {type: [String]},
        summary: {type: String}
    }
});


const IndexTeam = mongoose.model('AllTeams', indexTeamSchema);
const IndexEvent = mongoose.model('AllEvents', indexEventSchema);
const IndexOPR = mongoose.model('AllOPRs', indexOPRSchema);
const IndexAI = mongoose.model('AllAIs', indexAISchema); 

module.exports = {
    IndexTeam,
    IndexEvent,
    IndexOPR,
    IndexAI,
    indexEventSchema,
    indexTeamSchema,
    indexOPRSchema,
    indexAISchema
};