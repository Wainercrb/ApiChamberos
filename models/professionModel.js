const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const profession = new Schema({
    id: { type: String },
    description: { type: String },
    status :{type: Boolean}
});
module.exports = mongoose.model('professions', profession);



