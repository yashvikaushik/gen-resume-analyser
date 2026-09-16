const mongoose = require("mongoose");

// Sub-schemas for structured report
const technicalQuestionSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"]
        },
        intend: {
            type: String,
            required: [true, "Intend is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        }
    },
    { _id: false }
);

const behavioralQuestionSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"]
        },
        intend: {
            type: String,
            required: [true, "Intend is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        }
    },
    { _id: false }
);

const skillGapsSchema = mongoose.Schema(
    {
        skill: {
            type: String,
            required: [true, "Skill is required"]
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Severity is required"]
        }
    },
    { _id: false }
);

const preparationPlanSchema = mongoose.Schema(
    {
        day: {
            type: Number,
            required: [true, "Day is required"]
        },
        focusAreas: {
            type: String,
            required: [true, "Focus Areas is required"]
        },
        tasksOfDay: {
            type: [String],
            required: [true, "Tasks of the day is required"]
        }
    },
    { _id: false }
);

const interviewReportSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        jobDescription: {
            type: String,
            required: [true, "Job Description is required"]
        },
        selfDescription: {
            type: String,
            required: [true, "Self Description is required"]
        },
        resume: {
            type: String,
            required: [true, "Resume is required"]
        },
        matchScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        technicalQuestions: [technicalQuestionSchema],
        behavioralQuestions: [behavioralQuestionSchema],
        skillGaps: [skillGapsSchema],
        preparationPlan: [preparationPlanSchema]
    },
    {
        timestamps: true
    }
);

const interviewReportModel = mongoose.model("interviewModel", interviewReportSchema);

module.exports = interviewReportModel;
