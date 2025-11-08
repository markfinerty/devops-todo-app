import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Todo } from "./models/Todo.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

// Parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.get('/', (req,res) => {
  console.log("Hi from nodemon.")
  res.send("Hi from nodemon\n")
});

/**
 * GET /todos
 * Get all todos
 */
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

/**
 * POST /todos
 * Create a new todo
 * Body: { "title": "Some task", "completed": false? }
 */
app.post("/todos", async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    const todo = await Todo.create({ title, completed });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

/**
 * GET /todos/:id
 * Get a single todo by id
 */
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: "Invalid todo id" });
  }
});

/**
 * PUT /todos/:id
 * Update a todo by id
 * Body: { "title": "...", "completed": true/false }
 */
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: "Invalid data or todo id" });
  }
});

/**
 * DELETE /todos/:id
 * Delete a todo by id
 */
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send(); // No content
  } catch (err) {
    res.status(400).json({ error: "Invalid todo id" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
