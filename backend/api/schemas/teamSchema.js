const mongoose = require('mongoose');
const { indexTeamSchema,indexEventSchema,indexOPRSchema} = require('../schemas/massSchema');

const teamSchema = new mongoose.Schema({
    name: {type: String},
    version: {type: Number},
    number: {type: Number, required: true, unique: true },
    info: {type: indexTeamSchema, required: true },
    events: { type: [indexEventSchema], default: [] },
    pointAverage: { type: Number},
    pointAveragePlayoff: {type: Number},
    points: {type: [Number]},
    performance: {
        wins: {type: Number},
        losses: {type: Number},
        ties: {type: Number}
    },
    opr: { type: indexOPRSchema }
});

const Team = mongoose.model('TeamCache', teamSchema);

module.exports = {
    Team,
};