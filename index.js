const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

let todos = [
  { id: 1, task: "Learn Node.js", completed: false, priority: "medium" },
  { id: 2, task: "Build a REST API", completed: false, priority: "medium" }
];

app.get('/todos', (req, res) => {
  let { completed } = req.query
  if (completed === 'true' || completed === 'false') {
    let isCompleted = completed === 'true';
    let filteredData = todos.filter(item => item.completed === isCompleted);
    return res.json(filteredData);
  } else {
    return res.json(todos);
  }
});

app.post('/todos', (req, res) => {
  const { task, priority } = req.body;

  if (!task) {
    return res.status(400).send("Task is required");
  }

  const newTodo = {
    id: todos.length + 1,
    task: task,
    completed: false,
    priority: priority || "medium"
  };

  todos.push(newTodo);
  return res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res, next) => {
  if (req.url.includes("complete-all")) next();
  else {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return res.status(404).send("To-Do item not found");
    }

    todo.task = req.body.task || todo.task;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    todo.priority = req.body.priority || todo.priority;

    return res.json(todo);
  }
});

app.put('/todos/complete-all', (req, res) => {
  if (!todos || todos.length === 0) {
    return res.status(404).send("No to-do items to mark as complete");
  }

  todos.forEach(item => {
    item.completed = true;
  });
  return res.status(200).send("All to-dos marked as complete");
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }

  todos.splice(index, 1);
  return res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
