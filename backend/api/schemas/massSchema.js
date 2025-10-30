const mongoose = require('mongoose');

const indexTeamSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true },
    number: {type: Number, required: true },
    location: {type: String, required: true}
});

const indexEventSchema = new mongoose.Schema({
    name: {type: String, required: true },
    code: {type: String, required: true, unique: true },
    typeName: {type: String, required: true },
    dateStart: {type: String, required: true },
    dateEnd: {type: String, required: true },
    venue: {type:String, required: true},
    city: {type:String, required: true},
    stateprov: {type:String, required: true},
    country: {type:String, required: true},
});

const IndexTeam = mongoose.model('AllTeams', indexTeamSchema);
const IndexEvent = mongoose.model('AllEvents', indexEventSchema);

module.exports = {
    IndexTeam,
    IndexEvent
};