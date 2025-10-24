const mongoose = require('mongoose');

const allTeamsSchema = new mongoose.Schema({
    teams: [{
        name: {type: String, required: true },
        number: {type: Number, required: true },
        location: {type: String, required: true}
    }]
});

const AllTeams = mongoose.model('AllTeams', allTeamsSchema);
module.exports = {
    AllTeams
};