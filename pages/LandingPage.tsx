
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Zap, FileText, ArrowRight, GraduationCap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const academicWorkTypes = [
    "Trabalhos Escolares",
    "Artigos Científicos",
    "Monografias",
    "TCC / Dissertações",
    "Teses de Doutorado",
    "Relatórios Técnicos"
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-900 uppercase bg-blue-50 rounded-full">
                Plataforma Académica Inteligente
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight academic-font">
                Trabalhos Académicos <span className="text-blue-900 italic">Perfeitos.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
                A ferramenta definitiva para estudantes que buscam excelência. Gere conteúdos estruturados sob as normas ABNT em segundos.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition shadow-lg hover:shadow-blue-900/20 flex items-center justify-center"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition"
                >
                  Aceder à Minha Conta
                </button>
              </div>
              <p className="mt-6 text-sm text-slate-400 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Pagamento único por trabalho. Sem subscrições mensais.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-900/10 to-transparent rounded-3xl -rotate-2"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
                <div className="flex items-center space-x-2 mb-6 border-b pb-4">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="ml-auto text-[10px] uppercase tracking-widest font-bold text-slate-400">Preview Académico</div>
                </div>
                <div className="space-y-5">
                  <div className="h-2 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-900 rounded-sm w-full mb-8"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-50 rounded w-full"></div>
                    <div className="h-2 bg-slate-50 rounded w-full"></div>
                    <div className="h-2 bg-slate-50 rounded w-5/6"></div>
                  </div>
                  <div className="py-6 border-y border-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-10 w-10 text-blue-900/20 mx-auto mb-2" />
                      <div className="text-[10px] font-bold text-slate-300 uppercase">Estrutura ABNT Automática</div>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-50 rounded w-full"></div>
                  <div className="h-2 bg-slate-50 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 academic-font">Excelência em Cada Detalhe</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Desenvolvemos uma tecnologia que compreende as nuances da escrita académica e as rigorosas exigências das normas brasileiras e internacionais.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-900/20">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Rigor Académico</h3>
              <p className="text-slate-600 leading-relaxed">Conteúdo gerado com base em fontes fidedignas e estruturado logicamente para garantir aprovação.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-900/20">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Normas ABNT</h3>
              <p className="text-slate-600 leading-relaxed">Esqueça a formatação manual. Citações, referências e margens configuradas automaticamente.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-900/20">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Velocidade Máxima</h3>
              <p className="text-slate-600 leading-relaxed">Poupe semanas de pesquisa. O SchoolMaster entrega um rascunho avançado em menos de 2 minutos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage (Replacement for Pricing) */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 academic-font">Suporte para Toda a sua Jornada Académica</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Seja um simples resumo para o ensino médio ou uma tese de doutoramento complexa, o SchoolMaster adapta-se ao seu nível de exigência.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {academicWorkTypes.map((type) => (
                  <div key={type} className="flex items-center text-slate-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-blue-900 mr-2" />
                    {type}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/register')}
                className="mt-10 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition inline-flex items-center"
              >
                Ver Tabela de Preços no Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                  Como Funciona?
                </h4>
                <ul className="space-y-6">
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold mr-3">1</span>
                    <p className="text-sm text-slate-600">Crie a sua conta gratuita em segundos.</p>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold mr-3">2</span>
                    <p className="text-sm text-slate-600">Introduza o tema e as configurações do seu trabalho.</p>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold mr-3">3</span>
                    <p className="text-sm text-slate-600">Visualize o rascunho e efectue o pagamento unitário.</p>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold mr-3">4</span>
                    <p className="text-sm text-slate-600">Desbloqueie o download em PDF e Word prontos para entrega.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-6 academic-font">Pronto para elevar o nível dos seus estudos?</h2>
          <p className="text-blue-100 text-xl mb-10">Junte-se a milhares de estudantes que já transformaram a sua produtividade académica.</p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-blue-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition shadow-2xl"
          >
            Criar Meu Primeiro Trabalho
          </button>
        </div>
      </section>
    </div>
  );
};
