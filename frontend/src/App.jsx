import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Task Manager</h1>
          <p>Manage your tasks with clean, responsive task workflows.</p>
        </div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/create">Create Task</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<TaskForm />} />
          <Route path="/edit/:id" element={<TaskForm />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>Task Manager App • Built with React, Vite, Axios, Express, and MongoDB.</span>
      </footer>
    </div>
  );
}

export default App;
