var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Event', new Schema({
    title: String,
    link: String,
    content: String,
    contentSnippent: String,
    guid: {
        required: true,
        type: String,
        index: true,
        unique: true,
        dropDups: true,
    },
    published: Boolean
}));