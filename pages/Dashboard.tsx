
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, FileText, CreditCard, ChevronRight, 
  Award, Clock, CheckCircle, TrendingUp 
} from 'lucide-react';
import { AcademicWork, UserProfile, WorkStatus } from '../types';

interface DashboardProps {
  works: AcademicWork[];
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ works, user }) => {
  const navigate = useNavigate();

  const getStatusInfo = (status: WorkStatus) => {
    switch (status) {
      case WorkStatus.DRAFT: 
        return { label: 'Em Edição', class: 'bg-slate-100 text-slate-600' };
      case WorkStatus.PENDING_PAYMENT: 
        return { label: 'Aguardando Pagamento', class: 'bg-amber-100 text-amber-700' };
      case WorkStatus.PAID: 
        return { label: 'Pago & Pronto', class: 'bg-emerald-100 text-emerald-700' };
      default: 
        return { label: 'Desconhecido', class: 'bg-slate-100 text-slate-400' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header com Saudação Contextual */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-900 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Portal do Estudante
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 academic-font">Olá, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-2 text-lg">Tens {works.length} trabalhos na tua biblioteca académica.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/new')}
            className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-black flex items-center shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="h-5 w-5 mr-2 stroke-[3px]" />
            Novo Trabalho
          </button>
        </div>
      </div>

      {/* Stats Cards Modernos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl">
              <FileText className="h-6 w-6" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{works.length}</div>
          <div className="text-slate-400 text-sm font-medium uppercase tracking-tight">Total de Projectos</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {works.filter(w => w.status === WorkStatus.PENDING_PAYMENT).length}
          </div>
          <div className="text-slate-400 text-sm font-medium uppercase tracking-tight">Pendentes</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {works.filter(w => w.status === WorkStatus.PAID).length}
          </div>
          <div className="text-slate-400 text-sm font-medium uppercase tracking-tight">Concluídos</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-3xl shadow-xl shadow-blue-900/10 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-black">{user.points}</div>
          <div className="text-blue-100 text-sm font-medium uppercase tracking-tight">Pontos Acumulados</div>
        </div>
      </div>

      {/* Lista de Trabalhos com Visual Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900 academic-font">Biblioteca Académica</h2>
          <div className="flex space-x-2">
             <div className="h-2 w-2 rounded-full bg-blue-900"></div>
             <div className="h-2 w-2 rounded-full bg-blue-300"></div>
          </div>
        </div>
        
        {works.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 text-slate-200 rounded-full mb-6">
              <FileText className="h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">A tua estante está vazia</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Começa a criar o teu primeiro trabalho académico hoje mesmo.</p>
            <button 
              onClick={() => navigate('/new')}
              className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg"
            >
              Criar Trabalho
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {works.map(work => {
              const status = getStatusInfo(work.status);
              return (
                <div 
                  key={work.id} 
                  className="px-8 py-6 flex items-center justify-between hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/editor/${work.id}`)}
                >
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-slate-100 text-slate-400 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-900 transition-colors">{work.title}</h4>
                      <div className="flex items-center text-sm text-slate-400 font-medium space-x-3 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{work.type}</span>
                        <span>•</span>
                        <span>{new Date(work.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.class}`}>
                      {status.label}
                    </span>
                    <div className="text-right hidden md:block">
                      <div className="font-black text-slate-900">{work.price.toLocaleString()} Kz</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Taxa Unitária</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
