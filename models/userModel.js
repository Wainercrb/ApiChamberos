const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    id: { type: String },
    name: { type: String },
    professionId: { type: Schema.ObjectId, ref: 'professionModel' },
    surnames: { type: String },
    age: { type: String },
    gender: { type: String},
    email: { type: String },
    pass: { type: String },
    latitud: { type: String },
    logitud: { type: String },
    approvalstatus: {type: Boolean}
});
module.exports = mongoose.model('users', user);