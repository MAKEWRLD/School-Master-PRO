
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyPage } from './pages/VerifyPage';
import { Dashboard } from './pages/Dashboard';
import { NewWork } from './pages/NewWork';
import { EditorPage } from './pages/EditorPage';
import { ProfilePage } from './pages/ProfilePage';
import { AcademicWork, UserProfile } from './types';
import { ApiService } from './services/api';

const PrivateRoute: React.FC<{ user: UserProfile | null; children: React.ReactElement }> = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [works, setWorks] = useState<AcademicWork[]>(() => {
    const saved = localStorage.getItem('sm_works');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistência em tempo real
  useEffect(() => {
    if (user) {
      localStorage.setItem('sm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sm_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sm_works', JSON.stringify(works));
  }, [works]);

  const handleLogout = () => {
    ApiService.logout();
    setUser(null);
  };

  return (
    <Router>
      <Layout onLogout={handleLogout} user={user}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={setUser} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} 
          />
          <Route path="/verify/:token" element={<VerifyPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute user={user}>
                <Dashboard works={works} user={user!} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/new" 
            element={
              <PrivateRoute user={user}>
                <NewWork user={user!} onCreated={w => setWorks([w, ...works])} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/editor/:id" 
            element={
              <PrivateRoute user={user}>
                <EditorPage works={works} onUpdate={(id, upds) => setWorks(prev => prev.map(w => w.id === id ? {...w, ...upds} : w))} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute user={user}>
                <ProfilePage user={user!} setUser={setUser} />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
