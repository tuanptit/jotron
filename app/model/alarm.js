var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var almSchema = new Schema({
    date: String,
    error: [],
    ip_address: String,
    name: String
});
module.exports = mongoose.model('Alarm', almSchema);