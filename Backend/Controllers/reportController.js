const Report = require("../Models/reportModel");
const userModel = require("../Models/userModel");

// ── POST /api/reports/save ─────────────────────────────────────
// Called by the frontend after the agent returns a result.
// Saves the report and appends its _id to the user's saved_reports.
const saveReport = async (req, res) => {
    const { company_name, report_data } = req.body;
    const userId = req.userId; // set by authUser middleware

    if (!company_name || !report_data) {
        return res.status(400).json({ success: false, message: "company_name and report_data are required." });
    }

    try {
        // Create and save the report document
        const report = new Report({
            user_id: userId,
            company_name: company_name.trim(),
            report_data,          // the parsed JSON object from data.raw
        });
        await report.save();

        // Append report _id to user's saved_reports array
        await userModel.findByIdAndUpdate(
            userId,
            { $push: { saved_reports: report._id } }
        );

        res.status(201).json({
            success: true,
            report: {
                _id: report._id,
                company_name: report.company_name,
                created_at: report.created_at,
            },
        });
    } catch (err) {
        console.error("saveReport error:", err);
        res.status(500).json({ success: false, message: "Failed to save report." });
    }
};

// ── GET /api/reports/my ────────────────────────────────────────
// Returns a list of the logged-in user's saved reports (summary only).
const getMyReports = async (req, res) => {
    const userId = req.userId;

    try {
        const reports = await Report.find({ user_id: userId })
            .select("_id company_name created_at")
            .sort({ created_at: -1 });

        res.json({ success: true, reports });
    } catch (err) {
        console.error("getMyReports error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch reports." });
    }
};

// ── GET /api/reports/:id ───────────────────────────────────────
// Returns the full report_data for a single report.
const getReportById = async (req, res) => {
    const userId = req.userId;

    try {
        const report = await Report.findOne({ _id: req.params.id, user_id: userId });
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }
        res.json({ success: true, report });
    } catch (err) {
        console.error("getReportById error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch report." });
    }
};

module.exports = { saveReport, getMyReports, getReportById };
