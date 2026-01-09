import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Check } from 'lucide-react';
import { WorkType, WorkPricing, AcademicWork, UserProfile, WorkStatus } from '../types';
import { generateAcademicContent } from '../services/gemini';

interface NewWorkProps {
  user: UserProfile;
  onCreated: (w: AcademicWork) => void;
}

export const NewWork: React.FC<NewWorkProps> = ({ user, onCreated }) => {
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
    tone: 'Académico'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const content = await generateAcademicContent({
        ...form,
        tone: form.tone
      });

      // Fix: Added missing versions property to match AcademicWork interface
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
        norm: 'ABNT',
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
      alert("Ocorreu um erro ao gerar o trabalho. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
        className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </button>

      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-blue-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          {step === 1 && "Escolha o tipo de trabalho"}
          {step === 2 && "Detalhes do projecto"}
          {step === 3 && "Configurações finais"}
        </h1>
        <p className="text-slate-500">
          {step === 1 && "Selecione a categoria que melhor se adapta à sua necessidade."}
          {step === 2 && "Insira as informações básicas para a formatação ABNT."}
          {step === 3 && "Ajuste o tom de voz e revise as informações."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(WorkPricing).map(([type, price]) => (
              <button
                key={type}
                onClick={() => {
                  setForm({...form, type: type as WorkType});
                  setStep(2);
                }}
                className={`p-6 border-2 rounded-xl text-left transition hover:border-blue-900 group ${form.type === type ? 'border-blue-900 bg-blue-50' : 'border-slate-100'}`}
              >
                <div className="font-bold text-slate-900 group-hover:text-blue-900 mb-1">{type}</div>
                <div className="text-slate-500 text-sm mb-4">Formatação ABNT inclusa</div>
                <div className="text-lg font-bold text-blue-900">{price.toLocaleString()} Kz</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tema do Trabalho</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                placeholder="Ex: O impacto da IA no mercado de trabalho em Angola"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instituição</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.institution}
                  onChange={e => setForm({...form, institution: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.course}
                  onChange={e => setForm({...form, course: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Autor</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.author}
                  onChange={e => setForm({...form, author: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                />
              </div>
            </div>
            <button 
              onClick={() => setStep(3)}
              disabled={!form.title}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Tom do Texto</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Formal', 'Técnico', 'Académico', 'Objetivo'].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm({...form, tone: t})}
                    className={`py-2 px-4 rounded-lg border-2 text-sm font-semibold transition ${form.tone === t ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-slate-100 text-slate-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tipo de Trabalho</span>
                <span className="font-bold">{form.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tema</span>
                <span className="font-bold max-w-xs text-right truncate">{form.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Norma</span>
                <span className="font-bold">ABNT</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center mt-4">
                <span className="text-lg font-bold text-slate-900">Total a Pagar</span>
                <span className="text-2xl font-black text-blue-900">{WorkPricing[form.type].toLocaleString()} Kz</span>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-800 transition flex items-center justify-center shadow-2xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Gerando Trabalho Inteligente...
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 mr-3" />
                  Gerar Trabalho Agora
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400">
              Ao clicar, nossa IA processará o conteúdo conforme as normas ABNT.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};