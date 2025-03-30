const mongoose = require("mongoose");
const { Schema, model } = mongoose;

mongoose
  .connect("mongodb://mongodb:27017/mydatabase")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  prompt: [
    {
      type: Schema.Types.ObjectId,
      ref: "prompts", // ✅ Fixed reference
    },
  ],
});

const promptSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  process: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", userSchema);
const Prompts = model("prompts", promptSchema);

module.exports = { User, Prompts };
