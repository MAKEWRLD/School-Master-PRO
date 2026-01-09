
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, School, GraduationCap, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import { UserProfile } from '../types';

export const RegisterPage: React.FC<{ onRegister: (u: UserProfile) => void }> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    course: '',
    city: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await ApiService.register(form);
      onRegister(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 text-white rounded-3xl mb-6 shadow-xl shadow-blue-900/20">
            <BookOpen className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 academic-font">Criar Conta PRO</h2>
          <p className="text-slate-500 mt-2">Inicie sua jornada académica com Inteligência Artificial.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="Ex: João Manuel"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Académico</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="email" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="nome@exemplo.ao"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="password" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Instituição</label>
            <div className="relative">
              <School className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="Ex: UAN"
                value={form.institution}
                onChange={e => setForm({...form, institution: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Curso</label>
            <div className="relative">
              <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="Ex: Engenharia"
                value={form.course}
                onChange={e => setForm({...form, course: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Cidade</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition font-medium"
                placeholder="Luanda"
                value={form.city}
                onChange={e => setForm({...form, city: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 mt-4 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Finalizar Registo Académico'}
          </button>
        </form>

        <p className="mt-10 text-center text-slate-500 text-sm font-medium">
          Já tem uma conta? <Link to="/login" className="text-blue-900 font-bold hover:underline">Entre no Portal</Link>
        </p>
      </div>
    </div>
  );
};
