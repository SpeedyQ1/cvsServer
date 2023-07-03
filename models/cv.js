const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    img: {type: String},
    theEmail: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    jobTitle: {type: String, required: true},
    summary: {type: String, required: true},
    skills: [{type: String, required: true}],
    experience: [{type: String, required: true}],
    education: {type: String, required: true},
    languages: {type: String, required: true},
    hobbies: {type: String, required: true},
    template: {type: String, required: true},
});

module.exports = mongoose.model('Cv', CvSchema);
