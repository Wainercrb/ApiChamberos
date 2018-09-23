const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    id: { type: String },
    name: { type: String },
    surnames: { type: String },
    birthdate: { type: String },
    gender: { type: String},
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    latitud: { type: String },
    longitud: { type: String },
    approvalstatus: {type: Boolean}
});
module.exports = mongoose.model('users', user);