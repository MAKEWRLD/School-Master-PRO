
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { NewWork } from './pages/NewWork';
import { EditorPage } from './pages/EditorPage';
import { ProfilePage } from './pages/ProfilePage';
import { AcademicWork, UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [works, setWorks] = useState<AcademicWork[]>(() => {
    const saved = localStorage.getItem('sm_works');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sm_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sm_works', JSON.stringify(works));
  }, [works]);

  const addWork = (work: AcademicWork) => {
    setWorks(prev => [work, ...prev]);
  };

  const updateWork = (id: string, updates: Partial<AcademicWork>) => {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/register" element={<RegisterPage onRegister={setUser} />} />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard works={works} user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/new" 
            element={user ? <NewWork user={user} onCreated={addWork} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/editor/:id" 
            element={user ? <EditorPage works={works} onUpdate={updateWork} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
