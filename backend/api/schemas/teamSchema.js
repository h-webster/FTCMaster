const mongoose = require('mongoose');
const { indexTeamSchema,indexEventSchema } = require('../schemas/massSchema');

const teamSchema = new mongoose.Schema({
    name: {type: String},
    version: {type: Number},
    number: {type: Number, required: true, unique: true },
    info: {type: indexTeamSchema, required: true },
    events: { type: [indexEventSchema], default: [] }
});

const Team = mongoose.model('TeamCache', teamSchema);

module.exports = {
    Team,
};