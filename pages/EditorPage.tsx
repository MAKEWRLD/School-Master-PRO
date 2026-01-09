import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import { 
  Save, Download, CreditCard, Lock, ArrowLeft, 
  Eye, Edit3, X, Check, Loader2, Info, History, 
  RotateCcw, FileText, ChevronRight, AlertCircle, Trash2
} from 'lucide-react';
import { AcademicWork, WorkStatus, PaymentMethod, AcademicContent, ContentVersion } from '../types';
import { ABNTPreview } from '../components/ABNTPreview';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { exportToPDF, exportToDocx } from '../services/abntService';

export const EditorPage: React.FC<{ works: AcademicWork[]; onUpdate: (id: string, updates: Partial<AcademicWork>) => void }> = ({ works, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const work = works.find(w => w.id === id);
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('preview');
  const [showPayment, setShowPayment] = useState(false);
  const [editingContent, setEditingContent] = useState<AcademicContent | null>(work?.content || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [versionPreview, setVersionPreview] = useState<ContentVersion | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const autoSaveTimer = useRef<number | null>(null);

  // Initialize Quill for the main content (Desenvolvimento)
  useEffect(() => {
    if (activeTab === 'editor' && editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Escreve aqui o desenvolvimento do teu trabalho académico...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'blockquote', 'code-block'],
            ['clean']
          ]
        }
      });

      if (editingContent?.desenvolvimento) {
        quillInstance.current.setText(editingContent.desenvolvimento);
      }

      quillInstance.current.on('text-change', () => {
        setEditingContent(prev => prev ? ({
          ...prev,
          desenvolvimento: quillInstance.current?.getText() || ''
        }) : null);
      });
    }
  }, [activeTab]);

  // Auto-save logic
  useEffect(() => {
    if (activeTab === 'editor') {
      autoSaveTimer.current = window.setInterval(() => {
        handleAutoSave();
      }, 30000); // 30 seconds
    }
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [activeTab, editingContent]);

  if (!work) return <div className="p-20 text-center academic-font text-2xl">Trabalho não encontrado.</div>;

  const isPaid = work.status === WorkStatus.PAID || work.status === WorkStatus.READY;

  const handleAutoSave = async () => {
    if (!editingContent || isSaving || !isPaid) return;
    setIsAutoSaving(true);
    await handleSave(true);
    setIsAutoSaving(false);
  };

  const handleSave = async (isAuto = false) => {
    if (!editingContent) return;
    setIsSaving(true);
    
    const newVersion: ContentVersion = {
      id: 'ver_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      content: { ...editingContent },
      label: isAuto ? 'Auto-save' : 'Versão Manual',
      authorId: work.userId
    };

    const updatedVersions = [...(work.versions || []), newVersion];
    
    onUpdate(work.id, { 
      content: editingContent, 
      versions: updatedVersions,
      updatedAt: Date.now()
    });
    
    await ApiService.saveWork({ 
      ...work, 
      content: editingContent, 
      versions: updatedVersions,
      updatedAt: Date.now()
    });
    
    setIsSaving(false);
    if (!isAuto) setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(format);
    try {
      if (format === 'pdf') await exportToPDF(work);
      else await exportToDocx(work);
    } catch (err) {
      alert("Erro ao exportar. Verifica a tua ligação.");
    } finally {
      setIsExporting(null);
    }
  };

  const handlePayment = async (method: string) => {
    setIsSaving(true);
    const success = await ApiService.processPayment(work.id, method);
    if (success) {
      onUpdate(work.id, { status: WorkStatus.PAID });
      setShowPayment(false);
      alert("Pagamento confirmado via " + method + "! Acesso total desbloqueado.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header/Toolbar */}
      <div className="bg-white border-b border-slate-200 py-3 sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center flex-1">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-xl mr-4 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-400" />
            </button>
            <div className="overflow-hidden">
              <h1 className="font-black text-slate-900 truncate max-w-md academic-font">{work.title}</h1>
              <div className="flex items-center space-x-2">
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">{work.type}</span>
                 {isAutoSaving && <span className="text-[10px] text-slate-400 font-bold animate-pulse">Auto-salvando...</span>}
                 {showSavedMsg && <span className="text-[10px] text-emerald-600 font-bold flex items-center animate-bounce"><Check className="h-3 w-3 mr-1" /> Salvo</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {[
                { id: 'preview', icon: Eye, label: 'Preview' },
                { id: 'editor', icon: Edit3, label: 'Editor' },
                { id: 'history', icon: History, label: 'Histórico' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === tab.id ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <tab.icon className="h-3.5 w-3.5 mr-1.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {isPaid ? (
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleExport('pdf')}
                  disabled={!!isExporting}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {isExporting === 'pdf' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
                  PDF
                </button>
                <button 
                  onClick={() => handleExport('docx')}
                  disabled={!!isExporting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isExporting === 'docx' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5 mr-1.5" />}
                  Word
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowPayment(true)}
                className="flex items-center px-6 py-2 bg-blue-900 text-white font-black text-xs uppercase rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Desbloquear PRO
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          {activeTab === 'preview' && <ABNTPreview work={work} />}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit sticky top-0">
                <div className="p-6 border-b bg-slate-50">
                  <h3 className="font-black text-slate-900 academic-font uppercase text-sm tracking-widest">Linha do Tempo</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {work.versions?.slice().reverse().map((v) => (
                    <button 
                      key={v.id}
                      onClick={() => setVersionPreview(v)}
                      className={`w-full p-5 text-left hover:bg-blue-50 transition-colors flex items-center justify-between group ${versionPreview?.id === v.id ? 'bg-blue-50 border-l-4 border-blue-900' : ''}`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{v.label}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{new Date(v.timestamp).toLocaleString()}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-900" />
                    </button>
                  ))}
                  {(!work.versions || work.versions.length === 0) && (
                    <div className="p-10 text-center text-slate-400 text-sm italic">Nenhuma versão registada.</div>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                {versionPreview ? (
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Visualização de Versão</span>
                        <h3 className="text-lg font-bold">{new Date(versionPreview.timestamp).toLocaleString()}</h3>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingContent(versionPreview.content);
                          setActiveTab('editor');
                          setVersionPreview(null);
                        }}
                        className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center"
                      >
                        <RotateCcw className="h-3 w-3 mr-2" /> Restaurar Esta
                      </button>
                    </div>
                    <div className="p-10 prose prose-slate max-w-none academic-font leading-relaxed">
                      <h4 className="font-bold uppercase mb-4">Desenvolvimento:</h4>
                      <p>{versionPreview.content.desenvolvimento}</p>
                      <hr className="my-8" />
                      <h4 className="font-bold uppercase mb-4">Referências:</h4>
                      <p className="whitespace-pre-line text-sm">{versionPreview.content.referencias}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px] border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                    <History className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-medium">Seleciona uma versão para pré-visualizar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-12 space-y-12 relative">
                
                {!isPaid && (
                  <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center p-12 text-center">
                    <div className="max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-black academic-font mb-4">Edição Bloqueada</h3>
                      <p className="text-slate-500 mb-8">Efectua o pagamento único para desbloquear o editor WYSIWYG, auto-save e exportação profissional.</p>
                      <button onClick={() => setShowPayment(true)} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                        Desbloquear SchoolMaster PRO
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                   <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest academic-font">Introdução</h2>
                   </div>
                </div>
                <textarea 
                  className="w-full h-48 p-8 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 academic-font text-lg leading-relaxed transition-all"
                  value={editingContent?.introducao}
                  onChange={e => setEditingContent(prev => prev ? ({...prev, introducao: e.target.value}) : null)}
                />

                <div className="flex items-center justify-between border-b border-slate-50 pt-12 pb-6">
                   <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest academic-font">Desenvolvimento (WYSIWYG)</h2>
                </div>
                <div className="rounded-3xl border-2 border-slate-100 overflow-hidden">
                  <div ref={editorRef} className="h-[600px]" />
                </div>

                <div className="flex items-center justify-between border-b border-slate-50 pt-12 pb-6">
                   <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest academic-font">Referências Bibliográficas</h2>
                   <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <AlertCircle className="h-3 w-3 mr-1" /> Formato ABNT Sugerido
                   </div>
                </div>
                <textarea 
                  className="w-full h-48 p-8 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 academic-font text-base leading-relaxed bg-slate-50/50"
                  value={editingContent?.referencias}
                  onChange={e => setEditingContent(prev => prev ? ({...prev, referencias: e.target.value}) : null)}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                   onClick={() => handleSave()}
                   disabled={isSaving}
                   className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-900 transition-all shadow-xl flex items-center disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar Nova Versão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal PRO */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900 text-white rounded-2xl mr-4 shadow-lg shadow-blue-900/20">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 academic-font">Checkout PRO</h2>
              </div>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
            </div>
            <div className="p-12 space-y-10">
              <div className="flex items-center justify-between bg-blue-50 p-6 rounded-3xl border border-blue-100">
                 <div>
                    <h4 className="font-bold text-blue-900">{work.type}</h4>
                    <p className="text-xs text-blue-600 font-medium">Desbloqueio definitivo do projecto</p>
                 </div>
                 <div className="text-3xl font-black text-blue-900">{work.price.toLocaleString()} Kz</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['Unitel Money', 'Express', 'PayPay', 'PayPal'].map(m => (
                  <button 
                    key={m}
                    disabled={isSaving}
                    onClick={() => handlePayment(m)}
                    className="p-6 border-2 border-slate-100 rounded-2xl flex flex-col items-center hover:border-blue-900 hover:bg-blue-50 transition-all disabled:opacity-50"
                  >
                    <div className="text-lg font-black text-slate-800">{m}</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Processamento Seguro</span>
                  </button>
                ))}
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-slate-400 mb-2">Ambiente criptografado SSL 256-bit</p>
                <div className="flex justify-center space-x-2 grayscale opacity-30">
                   <div className="w-8 h-5 bg-slate-400 rounded-sm" />
                   <div className="w-8 h-5 bg-slate-400 rounded-sm" />
                   <div className="w-8 h-5 bg-slate-400 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};