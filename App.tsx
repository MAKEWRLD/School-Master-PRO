
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

// Componente para proteger rotas privadas
const PrivateRoute: React.FC<{ user: UserProfile | null; children: React.ReactElement }> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
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

  const addWork = (work: AcademicWork) => {
    setWorks(prev => [work, ...prev]);
  };

  const updateWork = (id: string, updates: Partial<AcademicWork>) => {
    setWorks(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={setUser} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <RegisterPage onRegister={setUser} />} 
          />
          
          {/* Rotas Privadas protegidas pelo PrivateRoute */}
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
                <NewWork user={user!} onCreated={addWork} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/editor/:id" 
            element={
              <PrivateRoute user={user}>
                <EditorPage works={works} onUpdate={updateWork} />
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
          
          {/* Redirecionamento Padrão */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
