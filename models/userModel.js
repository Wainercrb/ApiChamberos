const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    id: { type: String },
    name: { type: String },
    surnames: { type: String },
    age: { type: String },
    gender: { type: String},
    email: { type: String },
    pass: { type: String },
    latitud: { type: String },
    logintud: { type: String }
});
module.exports = mongoose.model('users', user);