const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, '..', 'data', 'todos.json');
fs.ensureFileSync(DATA_FILE);
if (fs.readJsonSync(DATA_FILE, { throws: false }) === null) {
  fs.writeJsonSync(DATA_FILE, []);
}

async function readTodos() {
  const arr = await fs.readJson(DATA_FILE).catch(() => []);
  return arr || [];
}

async function writeTodos(todos) {
  await fs.writeJson(DATA_FILE, todos);
}

// Routes
app.get('/api/todos', async (req, res) => {
  const todos = await readTodos();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const todos = await readTodos();
  const newTodo = { id: Date.now().toString(), title, done: false };
  todos.unshift(newTodo);
  await writeTodos(todos);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;
  const todos = await readTodos();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  if (title !== undefined) todos[idx].title = title;
  if (done !== undefined) todos[idx].done = done;
  await writeTodos(todos);
  res.json(todos[idx]);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  let todos = await readTodos();
  todos = todos.filter(t => t.id !== id);
  await writeTodos(todos);
  res.json({ ok: true });
});

// Health
app.get('/healthz', (req, res) => res.send('ok'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
