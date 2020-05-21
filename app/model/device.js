var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    name: String,
    ip_address: String,
    read_community: String,
    write_community: String,
    has_alarm: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Device', deviceSchema);