import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const listTodos = async () => {
  const res = await axios.get(`${API_BASE}/api/todos`);
  return res.data;
};
export const addTodo = async (body) => {
  const res = await axios.post(`${API_BASE}/api/todos`, body);
  return res.data;
};
export const toggleTodo = async (id, body) => {
  const res = await axios.put(`${API_BASE}/api/todos/${id}`, body);
  return res.data;
};
export const deleteTodo = async (id) => {
  const res = await axios.delete(`${API_BASE}/api/todos/${id}`);
  return res.data;
};
