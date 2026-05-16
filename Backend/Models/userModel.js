const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    saved_reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report"
        }
    ]
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = userModel;
