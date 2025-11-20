const mongoose = require('mongoose');

const extraSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    val: { type: Number }
});


const extraData = mongoose.model('extraData', extraSchema);

module.exports = {
    extraData,
    extraSchema
};