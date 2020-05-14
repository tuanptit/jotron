var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    name: String,
    ip_address: String,
    read_community: String,
    write_community: String,
    alarms: [{type: Schema.Types.ObjectId, ref: 'Alarm'}]
});
module.exports = mongoose.model('Device', deviceSchema);