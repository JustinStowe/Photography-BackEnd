const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: false },
  image: { type: String, required: true },
  cloudinary_id: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;