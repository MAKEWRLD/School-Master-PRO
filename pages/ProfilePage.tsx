
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, School, GraduationCap, MapPin, Award, Save } from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  const [form, setForm] = useState(user);

  const handleSave = () => {
    setUser(form);
    alert("Perfil actualizado com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seu Perfil</h1>
          <p className="text-slate-500">Gerencie seus dados e preferências.</p>
        </div>
        <div className="bg-purple-100 px-6 py-2 rounded-full flex items-center text-purple-700 border border-purple-200">
          <Award className="h-5 w-5 mr-2" />
          <span className="font-bold">{user.points} Pontos SchoolMaster</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900"
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
                type="email"
                disabled
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-slate-50 text-slate-500"
                value={form.email}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Instituição</label>
            <div className="relative">
              <School className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900"
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
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900"
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
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900"
                value={form.city}
                onChange={e => setForm({...form, city: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <button 
            onClick={handleSave}
            className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-800 transition shadow-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Guardar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
