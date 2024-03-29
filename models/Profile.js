const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
    type: {
        type: String
    },
    describe: {
        type: String
    },
    income: {
        type: String,
        require: true
    },
    expend: {
        type: String,
        require: true
    },
    cash: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = Profile = mongoose.model('Profile', ProfileSchema)