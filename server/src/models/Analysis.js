import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume"
    },

    jobDescription: String,

    companyName: String,

    jobTitle: String,

    matchScore: Number,

    atsScore: Number,

    skillMatchScore: Number,

    experienceMatchScore: Number,

    keywordMatchScore: Number,

    strengths: [String],

    missingSkills: [String],

    suggestions: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);