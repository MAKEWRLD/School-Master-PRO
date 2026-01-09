import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Download, CreditCard, Lock, ArrowLeft, 
  Eye, Edit3, X, Check, Loader2, Info, History, RotateCcw
} from 'lucide-react';
import { AcademicWork, WorkStatus, PaymentMethod, AcademicContent, ContentVersion } from '../types';
import { ABNTPreview } from '../components/ABNTPreview';
import { StorageService } from '../services/storage';
import { exportToPDF } from '../services/abntService';

interface EditorPageProps {
  works: AcademicWork[];
  onUpdate: (id: string, updates: Partial<AcademicWork>) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({ works, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const work = works.find(w => w.id === id);
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('preview');
  const [showPayment, setShowPayment] = useState(false);
  const [editingContent, setEditingContent] = useState<AcademicContent | null>(work?.content || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (showSavedMsg) {
      const timer = setTimeout(() => setShowSavedMsg(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSavedMsg]);

  if (!work) return <div className="p-20 text-center academic-font text-2xl">Trabalho não encontrado.</div>;

  const handleSave = async (isAutoSave = false) => {
    if (!editingContent) return;
    setIsSaving(true);
    
    const newVersion: ContentVersion = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      content: { ...editingContent },
      label: isAutoSave ? 'Salvamento Automático' : 'Versão Manual'
    };

    const updatedVersions = [...(work.versions || []), newVersion];
    
    onUpdate(work.id, { 
      content: editingContent, 
      versions: updatedVersions,
      updatedAt: Date.now()
    });
    
    StorageService.saveWork({ 
      ...work, 
      content: editingContent, 
      versions: updatedVersions,
      updatedAt: Date.now()
    });
    
    setIsSaving(false);
    if (!isAutoSave) setShowSavedMsg(true);
  };

  const handleRestoreVersion = (version: ContentVersion) => {
    setEditingContent(version.content);
    setActiveTab('editor');
    alert("Versão restaurada no editor. Lembre-se de salvar.");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(work);
    } catch (err) {
      console.error(err);
      alert("Erro ao exportar PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const simulatePayment = () => {
    onUpdate(work.id, { status: WorkStatus.PAID });
    setShowPayment(false);
    alert("Pagamento confirmado! Acesso total desbloqueado.");
  };

  const isPaid = work.status === WorkStatus.PAID || work.status === WorkStatus.READY;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Barra de Ferramentas Fixa */}
      <div className="bg-white border-b border-slate-200 py-3 sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center flex-1">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-2 hover:bg-slate-100 rounded-xl mr-4 transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="h-5 w-5 text-slate-400" />
            </button>
            <div className="overflow-hidden">
              <h1 className="font-black text-slate-900 truncate max-w-[200px] md:max-w-md academic-font">{work.title}</h1>
              <div className="flex items-center space-x-2">
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">{work.type}</span>
                 {showSavedMsg && (
                   <span className="text-[10px] text-emerald-600 font-bold flex items-center animate-pulse">
                     <Check className="h-3 w-3 mr-1" /> Guardado
                   </span>
                 )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mr-4">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`flex items-center px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-white text-blue-900 shadow-lg scale-[1.05]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button 
                onClick={() => setActiveTab('editor')}
                className={`flex items-center px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-white text-blue-900 shadow-lg scale-[1.05]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editor
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex items-center px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-blue-900 shadow-lg scale-[1.05]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <History className="h-4 w-4 mr-2" />
                Histórico
              </button>
            </div>

            <button 
              onClick={() => handleSave()}
              disabled={isSaving}
              className="flex items-center px-4 py-2 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </button>

            {isPaid ? (
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center px-6 py-2 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
              >
                {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Exportar ABNT
              </button>
            ) : (
              <button 
                onClick={() => setShowPayment(true)}
                className="flex items-center px-8 py-2 bg-blue-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Desbloquear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto bg-slate-100 scroll-smooth">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {activeTab === 'history' ? (
            <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 academic-font uppercase tracking-widest">Histórico de Versões</h2>
                <div className="text-xs text-slate-400 font-bold">{work.versions?.length || 0} versões salvas</div>
              </div>
              <div className="divide-y divide-slate-100">
                {work.versions?.slice().reverse().map((v, i) => (
                  <div key={v.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mr-4">
                        <History className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{v.label || `Versão ${work.versions.length - i}`}</div>
                        <div className="text-xs text-slate-400">{new Date(v.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRestoreVersion(v)}
                      className="flex items-center px-4 py-2 text-blue-900 font-bold text-xs uppercase tracking-widest border border-blue-100 rounded-lg hover:bg-blue-900 hover:text-white transition-all"
                    >
                      <RotateCcw className="h-3 w-3 mr-2" />
                      Restaurar
                    </button>
                  </div>
                ))}
                {(!work.versions || work.versions.length === 0) && (
                  <div className="p-12 text-center text-slate-400">
                    Nenhuma versão salva ainda. O sistema salva automaticamente quando você clica em "Salvar".
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'preview' ? (
            <div className="flex flex-col items-center">
              <ABNTPreview work={work} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {editingContent && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-12 space-y-12">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center font-black">1</div>
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest academic-font">Introdução</h2>
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Limite: ~300 palavras</span>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      className={`w-full h-64 p-8 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 academic-font text-lg leading-relaxed transition-all ${!isPaid ? 'opacity-50 select-none pointer-events-none' : ''}`}
                      placeholder="Inicia a tua introdução académica aqui..."
                      value={editingContent.introducao}
                      onChange={e => setEditingContent({...editingContent, introducao: e.target.value})}
                    />
                    {!isPaid && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px] rounded-3xl">
                         <div className="bg-white px-6 py-3 rounded-2xl shadow-xl border flex items-center font-bold text-slate-600">
                            <Lock className="h-4 w-4 mr-2 text-blue-900" /> Edição bloqueada
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-50 pt-12 pb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center font-black">2</div>
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest academic-font">Desenvolvimento</h2>
                    </div>
                    <button className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline">Adicionar Citação</button>
                  </div>

                  <textarea 
                    className="w-full h-[600px] p-8 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 academic-font text-lg leading-relaxed transition-all"
                    value={editingContent.desenvolvimento}
                    onChange={e => setEditingContent({...editingContent, desenvolvimento: e.target.value})}
                  />

                  <div className="flex items-center space-x-4 pt-12 pb-6 border-b border-slate-50">
                    <div className="h-10 w-10 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center font-black">3</div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest academic-font">Referências</h2>
                  </div>

                  <textarea 
                    className="w-full h-64 p-8 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 academic-font text-base leading-relaxed bg-slate-50/50"
                    placeholder="AUTOR. Título: subtítulo. Edição. Local: Editora, ano."
                    value={editingContent.referencias}
                    onChange={e => setEditingContent({...editingContent, referencias: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-w-lg w-full overflow-hidden border border-white/20">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 academic-font">Activação do Projecto</h2>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="text-center space-y-2">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Valor Unitário</div>
                <div className="text-6xl font-black text-blue-900 tracking-tighter">{work.price.toLocaleString()} <span className="text-2xl">Kz</span></div>
                <div className="inline-flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full mt-4">
                   <Info className="h-3 w-3 mr-1" /> Acesso vitalício a este trabalho
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[PaymentMethod.UNITEL_MONEY, PaymentMethod.EXPRESS, PaymentMethod.PAYPAY].map(method => (
                  <button 
                    key={method}
                    className="group w-full p-6 border-2 border-slate-100 rounded-3xl flex items-center justify-between hover:border-blue-900 hover:bg-blue-50 transition-all text-left relative overflow-hidden"
                  >
                    <div className="flex items-center relative z-10">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mr-5 group-hover:bg-white transition-colors">
                        <CreditCard className="h-7 w-7 text-blue-900" />
                      </div>
                      <div>
                        <span className="font-black text-slate-800 text-lg">{method}</span>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Pagamento Imediato</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-6">
                <button 
                  onClick={simulatePayment}
                  className="w-full bg-blue-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-800 transition-all shadow-2xl shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Pagar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};