import { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import InstructorDashboard from './pages/InstructorDashboard.jsx';
import InstructorLogin from './pages/InstructorLogin.jsx';
import Login from './pages/Login.jsx';

const INSTRUCTOR_SESSION_KEY = 'edupulse_instructor_session_v1';

function readInstructorSession() {
  const saved = localStorage.getItem(INSTRUCTOR_SESSION_KEY);
  if (!saved) return null;

  let user;
  try {
    user = JSON.parse(saved);
  } catch {
    localStorage.removeItem(INSTRUCTOR_SESSION_KEY);
    return null;
  }

  if (!user || user.role !== 'instructor' || typeof user.name !== 'string' || !user.name.trim()) {
    localStorage.removeItem(INSTRUCTOR_SESSION_KEY);
    return null;
  }

  return user;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [instructorUser, setInstructorUser] = useState(readInstructorSession);
  const [view, setView] = useState(() => (instructorUser ? 'instructorDashboard' : 'main'));

  const handleLogin = (submittedUserName) => {
    setUserName(submittedUserName);
    setIsLoggedIn(true);
  };

  const handleInstructorLogin = (user) => {
    if (user.role !== 'instructor') return;
    localStorage.setItem(INSTRUCTOR_SESSION_KEY, JSON.stringify(user));
    setInstructorUser(user);
    setView('instructorDashboard');
  };

  const handleInstructorSignOut = () => {
    localStorage.removeItem(INSTRUCTOR_SESSION_KEY);
    setInstructorUser(null);
    setView('instructorLogin');
  };

  if (view === 'instructorDashboard' && instructorUser?.role === 'instructor') {
    return <InstructorDashboard user={instructorUser} onSignOut={handleInstructorSignOut} />;
  }

  if (view === 'instructorLogin') {
    return (
      <InstructorLogin
        onLogin={handleInstructorLogin}
        onBackToMain={() => setView('main')}
      />
    );
  }

  return isLoggedIn
    ? <Dashboard userName={userName} />
    : <Login onLogin={handleLogin} onInstructorLogin={() => setView('instructorLogin')} />;
}
