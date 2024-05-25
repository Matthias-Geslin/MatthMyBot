const { Schema, model } = require('mongoose');

const warningSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
    },
    counter: {
        type: Number,
        default: 1,
    },
}, {timestamps: true});

module.exports = model('WarningProfile', warningSchema);

