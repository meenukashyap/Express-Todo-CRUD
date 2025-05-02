const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const PORT = 3000;
const DB_PATH = "./db.json";

// Helper function to read todos from db.json
function readTodos() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data).todos;
}

// Helper function to write todos to db.json
function writeTodos(todos) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ todos }, null, 2));
}

// Get all todos
app.get("/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Add a new todo
app.post("/todos", (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title || "Untitled Task",
    status: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json({ message: "Todo added", todo: newTodo });
});

// Update status of todos with even ID (from false → true)
app.patch("/todos/update-even", (req, res) => {
  let todos = readTodos();
  let updatedCount = 0;

  todos = todos.map(todo => {
    if (todo.id % 2 === 0 && todo.status === false) {
      todo.status = true;
      updatedCount++;
    }
    return todo;
  });

  writeTodos(todos);
  res.json({ message: `${updatedCount} todos updated.` });
});

// Delete all todos with status === true
app.delete("/todos/delete-true", (req, res) => {
  const todos = readTodos();
  const remainingTodos = todos.filter(todo => todo.status !== true);
  const deletedCount = todos.length - remainingTodos.length;

  writeTodos(remainingTodos);
  res.json({ message: `${deletedCount} todos deleted.` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
