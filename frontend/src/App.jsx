import React, { useEffect, useState } from 'react';
import { listTodos, addTodo, toggleTodo, deleteTodo } from './api';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  async function refresh() {
    const data = await listTodos();
    setTodos(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await addTodo({ title: title.trim() });
    setTitle('');
    await refresh();
  }

  async function handleToggle(t) {
    await toggleTodo(t.id, { done: !t.done });
    await refresh();
  }

  async function handleDelete(id) {
    await deleteTodo(id);
    await refresh();
  }

  return (
    <div className="wrap">
      <h1>Todo App</h1>
      <form onSubmit={handleAdd} className="form">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo..." />
        <button>Add</button>
      </form>

      <ul className="list">
        {todos.map(t => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <span onClick={() => handleToggle(t)}>{t.title}</span>
            <button onClick={() => handleDelete(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
