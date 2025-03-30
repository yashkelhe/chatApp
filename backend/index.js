const express = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Prompts } = require("./model/mongo");
const { GoogleGenAI } = require("@google/genai");
const PORT = process.env.PORT || 8080;
const app = express();
const cors = require("cors");
app.use(express.json()); // ✅ Parse JSON body
app.use(cors());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAa3679uLTaOE_EYF77aK6VAUDXxCBrMsc",
});
// ✅ Zod Validation Schemas
const SignUpInputs = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignInInputs = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const PromptInput = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
});

// ✅ Middleware for JWT Authentication
async function authenticateToken(req, res, next) {
  try {
    const token = req.headers["token"];
    if (!token)
      return res.status(401).json({ error: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, "letsgo");
    const user = await User.findOne({ email: decoded.email });

    if (!user)
      return res.status(401).json({ error: "Unauthorized: Invalid token" });

    req.userEmail = user.email;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token", details: err });
  }
}

// ✅ Sign-up Route
app.post("/signUp", async (req, res) => {
  const parsed = SignUpInputs.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.errors });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ email }, "letsgo", { expiresIn: "1h" });
    console.log("message recieved", name, email, password);
    return res.json({ token, user });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to create user", details: err.message });
  }
});

// ✅ Sign-in Route (Fixed)
app.post("/signIn", async (req, res) => {
  const parsed = SignInInputs.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.errors });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email }, "letsgo", { expiresIn: "1h" });

    console.log("Login successful for:", email);
    return res.json({ token, message: "Login successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to sign in", details: err.message });
  }
});

// ✅ Secure AI Prompt Submission Route
app.post("/prompt", authenticateToken, async (req, res) => {
  const parsed = PromptInput.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid prompt", details: parsed.error.errors });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: req.body.prompt }], // ✅ Proper API structure
    });

    const newPrompt = await Prompts.create({
      email: req.userEmail,
      prompt: req.body.prompt,
      answer: response.text,
    });

    return res.json({
      answer: newPrompt.answer,
      prompt: newPrompt.prompt,
      message: "Prompt submitted successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to submit prompt", details: err.message });
  }
});

// AIzaSyAa3679uLTaOE_EYF77aK6VAUDXxCBrMsc;
// ✅ Get Output Route
app.get("/getPromptAanswer", authenticateToken, async (req, res) => {
  try {
    const outputPrompt = await Prompts.find({ email: req.userEmail });
    if (!outputPrompt)
      return res.status(404).json({ error: "Prompt not found" });
    console.log("array", outputPrompt);
    return res.json({ outputPrompt });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch prompt", details: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// ✅ Queue Function (Placeholder for Processing Prompts)

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
