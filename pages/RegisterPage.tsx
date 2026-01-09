
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, School, GraduationCap, MapPin } from 'lucide-react';
import { UserProfile } from '../types';

export const RegisterPage: React.FC<{ onRegister: (u: UserProfile) => void }> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    course: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: form.name,
      email: form.email,
      institution: form.institution,
      course: form.course,
      city: form.city,
      points: 50 // Welcome points
    };
    onRegister(newUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 text-white rounded-2xl mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Comece hoje mesmo</h2>
          <p className="text-slate-500">Crie sua conta e gere seus trabalhos em minutos</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="Seu nome"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="email" required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="exemplo@email.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="password" required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instituição</label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="Ex: UAN"
                value={form.institution}
                onChange={e => setForm({...form, institution: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="Ex: Economia"
                value={form.course}
                onChange={e => setForm({...form, course: e.target.value})}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="Luanda"
                value={form.city}
                onChange={e => setForm({...form, city: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="md:col-span-2 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg mt-4"
          >
            Criar Conta Gratuita
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-sm">
          Já tem uma conta? <Link to="/login" className="text-blue-900 font-bold hover:underline">Entre aqui</Link>
        </p>
      </div>
    </div>
  );
};
