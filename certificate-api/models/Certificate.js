const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  },

  certificateId: {
    type: String,
    required: true,
    unique: true
  },

  date: {
    type: String,
    required: true
  },

  // Certificate Type
  certificateType: {
    type: String,
    required: true,
    default: "completion"
  },

  // Instructor
  instructor: {
    type: String,
    default: ""
  },

  // Director
  director: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Certificate", certificateSchema);