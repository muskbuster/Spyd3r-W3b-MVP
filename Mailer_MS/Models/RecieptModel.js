// model to store flagged transactions
// and all mails sent

const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    mailID: {
        type: String,
        required: true,
    },
    mailSent: {
        type: Boolean,
        required: true,
    },

});

const Receipt = mongoose.model("Receipt", Schema);

module.exports = { Receipt };