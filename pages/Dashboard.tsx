
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, CreditCard, ChevronRight, Award, Clock } from 'lucide-react';
import { AcademicWork, UserProfile, WorkStatus } from '../types';

interface DashboardProps {
  works: AcademicWork[];
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ works, user }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: WorkStatus) => {
    switch (status) {
      case WorkStatus.DRAFT: return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">EM EDIÇÃO</span>;
      case WorkStatus.PENDING_PAYMENT: return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">PAGAMENTO PENDENTE</span>;
      case WorkStatus.PAID: return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">PAGO</span>;
      case WorkStatus.READY: return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">DISPONÍVEL</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Olá, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500">Gerencie seus trabalhos académicos e crie novos projetos.</p>
        </div>
        <button 
          onClick={() => navigate('/new')}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:bg-blue-800 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Trabalho
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{works.length}</div>
          <div className="text-slate-500 text-sm">Trabalhos criados</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-xl">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendentes</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {works.filter(w => w.status === WorkStatus.PENDING_PAYMENT).length}
          </div>
          <div className="text-slate-500 text-sm">Aguardando pagamento</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pontos</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{user.points}</div>
          <div className="text-slate-500 text-sm">Fidelização acumulada</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900">Seus Trabalhos Recentes</h2>
          <button className="text-sm text-blue-900 font-semibold hover:underline">Ver todos</button>
        </div>
        
        {works.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-300 rounded-full mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum trabalho ainda</h3>
            <p className="text-slate-500 mb-6">Crie o seu primeiro trabalho académico agora.</p>
            <button 
              onClick={() => navigate('/new')}
              className="text-blue-900 font-bold hover:underline"
            >
              Começar agora →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {works.map(work => (
              <div 
                key={work.id} 
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
                onClick={() => navigate(`/editor/${work.id}`)}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-xl mr-4">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{work.title}</h4>
                    <div className="flex items-center text-sm text-slate-500 space-x-2">
                      <span>{work.type}</span>
                      <span>•</span>
                      <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  {getStatusBadge(work.status)}
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-slate-900">{work.price.toLocaleString()} Kz</div>
                    <div className="text-xs text-slate-400">Total Pago</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
