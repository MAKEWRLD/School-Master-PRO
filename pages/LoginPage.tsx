
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { ApiService } from '../services/api';
import { UserProfile } from '../types';

export const LoginPage: React.FC<{ onLogin: (u: UserProfile) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await ApiService.login(email, password);
      onLogin(user);
      navigate('/dashboard');
    } catch (err) {
      alert("Falha no login. Verifique as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 text-white rounded-3xl mb-6 shadow-xl shadow-blue-900/20">
            <BookOpen className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 academic-font">Aceder ao SchoolMaster</h2>
          <p className="text-slate-500 mt-2">Bem-vindo de volta à excelência académica.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Endereço de Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="email" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="nome@universidade.ao"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="password" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center group"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                Entrar no Portal
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Novo por aqui? <Link to="/register" className="text-blue-900 font-bold hover:underline">Criar conta académica</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
