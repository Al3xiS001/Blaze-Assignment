const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    "First Name": String,
    "Last Name": String,
    "Email": String,
    "Phone Number": String
});

module.exports = mongoose.model('tasks',TaskSchema);