
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { UserProfile } from '../types';

export const LoginPage: React.FC<{ onLogin: (u: UserProfile) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    const user: UserProfile = {
      id: '1',
      name: 'Utilizador Demo',
      email,
      institution: 'Universidade Agostinho Neto',
      course: 'Ciência da Computação',
      city: 'Luanda',
      points: 100
    };
    onLogin(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 text-white rounded-2xl mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
          <p className="text-slate-500">Acesse sua conta SchoolMaster</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-sm">
          Não tem uma conta? <Link to="/register" className="text-blue-900 font-bold hover:underline">Registe-se aqui</Link>
        </p>
      </div>
    </div>
  );
};
