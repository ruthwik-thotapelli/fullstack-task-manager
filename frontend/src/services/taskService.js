import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TASKS_ENDPOINT = `${API_BASE}/api/tasks`;

export const fetchTasks = (status) => {
  const url = status ? `${TASKS_ENDPOINT}?status=${encodeURIComponent(status)}` : TASKS_ENDPOINT;
  return axios.get(url);
};

export const fetchTask = (id) => axios.get(`${TASKS_ENDPOINT}/${id}`);
export const createTask = (payload) => axios.post(TASKS_ENDPOINT, payload);
export const updateTask = (id, payload) => axios.put(`${TASKS_ENDPOINT}/${id}`, payload);
export const deleteTask = (id) => axios.delete(`${TASKS_ENDPOINT}/${id}`);
