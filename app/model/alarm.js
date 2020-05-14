var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var almSchema = new Schema({
    date: String,
    error: String,
    ip_address: String
});
module.exports = mongoose.model('Alarm', almSchema);