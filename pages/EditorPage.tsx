
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Download, CreditCard, Lock, ArrowLeft, Eye, Edit3, X } from 'lucide-react';
import { AcademicWork, WorkStatus, PaymentMethod } from '../types';
import { ABNTPreview } from '../components/ABNTPreview';

interface EditorPageProps {
  works: AcademicWork[];
  onUpdate: (id: string, updates: Partial<AcademicWork>) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({ works, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const work = works.find(w => w.id === id);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');
  const [showPayment, setShowPayment] = useState(false);
  const [editingContent, setEditingContent] = useState(work?.content || null);

  if (!work) return <div className="p-20 text-center">Trabalho não encontrado.</div>;

  const handleSave = () => {
    if (editingContent) {
      onUpdate(work.id, { content: editingContent });
      alert("Trabalho salvo com sucesso!");
    }
  };

  const simulatePayment = () => {
    onUpdate(work.id, { status: WorkStatus.PAID });
    setShowPayment(false);
    alert("Pagamento processado com sucesso! O download está disponível.");
  };

  const isPaid = work.status === WorkStatus.PAID || work.status === WorkStatus.READY;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Action Bar */}
      <div className="bg-white border-b border-slate-200 py-3 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg mr-4">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </button>
            <div>
              <h1 className="font-bold text-slate-900 truncate max-w-xs">{work.title}</h1>
              <p className="text-xs text-slate-400">{work.type} • Norma ABNT</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-100 p-1 rounded-lg mr-4">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'preview' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </button>
              <button 
                onClick={() => setActiveTab('editor')}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'editor' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </button>
            </div>

            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 text-slate-700 font-bold text-sm hover:bg-slate-100 rounded-lg transition"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </button>

            {isPaid ? (
              <button className="flex items-center px-4 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition shadow-md">
                <Download className="h-4 w-4 mr-2" />
                Baixar (PDF/DOCX)
              </button>
            ) : (
              <button 
                onClick={() => setShowPayment(true)}
                className="flex items-center px-6 py-2 bg-blue-900 text-white font-bold text-sm rounded-lg hover:bg-blue-800 transition shadow-md"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar e Desbloquear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isPaid && (
          <div className="mb-6 bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-bold">Modo de visualização limitada</p>
                <p className="text-yellow-700 text-sm">Efectue o pagamento para editar livremente e remover as marcas de água do PDF.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
            >
              Pagar Agora
            </button>
          </div>
        )}

        {activeTab === 'preview' ? (
          <div className="flex flex-col items-center">
            <ABNTPreview work={work} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-8 max-w-4xl mx-auto">
            {editingContent && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Introdução</label>
                  <textarea 
                    className="w-full h-40 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900 academic-font"
                    value={editingContent.introducao}
                    onChange={e => setEditingContent({...editingContent, introducao: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Desenvolvimento</label>
                  <textarea 
                    className="w-full h-96 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900 academic-font"
                    value={editingContent.desenvolvimento}
                    onChange={e => setEditingContent({...editingContent, desenvolvimento: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Conclusão</label>
                  <textarea 
                    className="w-full h-40 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900 academic-font"
                    value={editingContent.conclusao}
                    onChange={e => setEditingContent({...editingContent, conclusao: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Referências (ABNT)</label>
                  <textarea 
                    className="w-full h-40 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900 academic-font"
                    value={editingContent.referencias}
                    onChange={e => setEditingContent({...editingContent, referencias: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Efectuar Pagamento</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Valor a pagar:</div>
                <div className="text-4xl font-black text-blue-900">{work.price.toLocaleString()} Kz</div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">Método de Pagamento</label>
                {[PaymentMethod.UNITEL_MONEY, PaymentMethod.EXPRESS, PaymentMethod.PAYPAY].map(method => (
                  <button 
                    key={method}
                    className="w-full p-4 border-2 border-slate-100 rounded-xl flex items-center hover:border-blue-900 transition focus:border-blue-900 focus:bg-blue-50"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-blue-900" />
                    </div>
                    <span className="font-bold text-slate-700">{method}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <button 
                  onClick={simulatePayment}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
