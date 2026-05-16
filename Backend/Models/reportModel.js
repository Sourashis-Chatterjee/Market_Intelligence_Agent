const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true,
    },
    report_data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
