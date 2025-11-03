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
    teams: { type: [indexTeamSchema], default: [] }
});

const IndexTeam = mongoose.model('AllTeams', indexTeamSchema);
const IndexEvent = mongoose.model('AllEvents', indexEventSchema);

module.exports = {
    IndexTeam,
    IndexEvent,
    indexEventSchema,
    indexTeamSchema
};