
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ApiService } from '../services/api';

export const VerifyPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) return setStatus('error');
      try {
        const msg = await ApiService.verifyEmail(token);
        setMessage(msg);
        setStatus('success');
      } catch (err: any) {
        setMessage(err.message || 'Falha na verificação. O link pode ter expirado.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-100">
        {status === 'loading' && (
          <div className="space-y-6">
            <Loader2 className="h-16 w-16 text-blue-900 animate-spin mx-auto" />
            <h2 className="text-2xl font-black text-slate-900 academic-font">A verificar conta...</h2>
            <p className="text-slate-500">Isto levará apenas um segundo.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-in zoom-in duration-500 space-y-8">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 academic-font mb-2">Conta Ativada!</h2>
              <p className="text-slate-500 leading-relaxed">{message}</p>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center"
            >
              Fazer Login Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-in slide-in-from-top-4 duration-500 space-y-8">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <XCircle className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 academic-font mb-2">Erro na Verificação</h2>
              <p className="text-slate-500 leading-relaxed">{message}</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/register')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Tentar Registo Novamente
              </button>
              <button 
                onClick={() => navigate('/')}
                className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-900 transition-colors"
              >
                Voltar à Página Inicial
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
