const mongoose = require('mongoose');

const indexTeamSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true },
    number: {type: Number, required: true },
    location: {type: String, required: true}
});

const IndexTeam = mongoose.model('AllTeams', indexTeamSchema);
module.exports = {
    IndexTeam
};