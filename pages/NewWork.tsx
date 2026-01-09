
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Check, Globe } from 'lucide-react';
import { WorkType, WorkPricing, AcademicWork, UserProfile, WorkStatus, AcademicNorm } from '../types';
import { generateAcademicContent } from '../services/gemini';

export const NewWork: React.FC<{ user: UserProfile; onCreated: (w: AcademicWork) => void }> = ({ user, onCreated }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: WorkType.SIMPLE,
    institution: user.institution,
    course: user.course,
    author: user.name,
    city: user.city,
    tone: 'Formal e Académico',
    norm: 'ABNT' as AcademicNorm
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const content = await generateAcademicContent(form);

      const newWork: AcademicWork = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        title: form.title,
        type: form.type,
        institution: form.institution,
        course: form.course,
        author: form.author,
        city: form.city,
        year: new Date().getFullYear().toString(),
        norm: form.norm,
        tone: form.tone,
        content: content,
        status: WorkStatus.PENDING_PAYMENT,
        price: WorkPricing[form.type],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        versions: []
      };

      onCreated(newWork);
      navigate(`/editor/${newWork.id}`);
    } catch (err) {
      alert("Erro ao gerar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 academic-font">Criador Inteligente PRO</h1>
          <p className="text-slate-500 mt-2">Personalize as normas e o tom para um trabalho perfeito.</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-slate-100 rounded-2xl"><X /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tema Central</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 text-lg font-bold"
                placeholder="Ex: Inteligência Artificial na Educação"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Norma Académica</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold"
                  value={form.norm}
                  onChange={e => setForm({...form, norm: e.target.value as AcademicNorm})}
                >
                  <option value="ABNT">ABNT (Brasil/Portugal)</option>
                  <option value="APA">APA (Internacional)</option>
                  <option value="CHICAGO">Chicago</option>
                  <option value="VANCOUVER">Vancouver (Saúde)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tom do Texto</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold"
                  value={form.tone}
                  onChange={e => setForm({...form, tone: e.target.value})}
                >
                  <option>Formal e Académico</option>
                  <option>Técnico e Analítico</option>
                  <option>Crítico e Reflexivo</option>
                  <option>Objetivo e Direto</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-900 p-8 rounded-[2rem] text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>
            <div className="space-y-4 text-sm opacity-90 mb-8">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Tipo</span>
                <span className="font-bold">{form.type}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Norma</span>
                <span className="font-bold">{form.norm}</span>
              </div>
            </div>
            <div className="text-4xl font-black mb-8">{WorkPricing[form.type].toLocaleString()} <span className="text-lg">Kz</span></div>
            <button 
              onClick={handleGenerate}
              disabled={loading || !form.title}
              className="w-full bg-white text-blue-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Gerar com IA PRO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const X = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
