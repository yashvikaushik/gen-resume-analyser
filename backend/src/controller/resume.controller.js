const { extractTextFromPDF } = require("../services/pdf.service");

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF resume"
            });
        }

        const text = await extractTextFromPDF(req.file.buffer);

        if (!text || !text.trim()) {
            return res.status(422).json({
                message: "Could not extract text from this PDF"
            });
        }

        return res.status(200).json({
            message: "Resume parsed successfully",
            text: text
        });

    } catch (error) {
        console.error("Resume parsing error:", error);

        return res.status(500).json({
            message: "Failed to read resume PDF"
        });
    }
};

module.exports = {
    uploadResume
};