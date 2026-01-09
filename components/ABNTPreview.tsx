
import React from 'react';
import { AcademicWork, WorkStatus } from '../types';

interface ABNTPreviewProps {
  work: AcademicWork;
}

export const ABNTPreview: React.FC<ABNTPreviewProps> = ({ work }) => {
  const isPaid = work.status === WorkStatus.PAID || work.status === WorkStatus.READY;

  const PageWrapper: React.FC<{ children: React.ReactNode; pageNum?: number }> = ({ children, pageNum }) => (
    <div className="relative abnt-page group">
      {!isPaid && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] select-none">
          <span className="text-9xl font-black -rotate-45 uppercase whitespace-nowrap">
            SchoolMaster Rascunho
          </span>
        </div>
      )}
      {children}
      {pageNum && (
        <div className="absolute top-[20mm] right-[20mm] text-[10pt] academic-font">
          {pageNum}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-12 pb-20">
      {/* CAPA - Não conta na numeração */}
      <PageWrapper>
        <div className="flex flex-col h-full items-center justify-between py-4">
          <div className="uppercase font-bold text-center space-y-2">
            <p>{work.institution}</p>
            <p className="text-sm font-normal">{work.course}</p>
          </div>
          <div className="uppercase font-bold text-center text-lg">{work.author}</div>
          <div className="uppercase font-bold text-center text-2xl max-w-md">{work.title}</div>
          <div className="text-center uppercase font-bold">
            <p>{work.city}</p>
            <p>{work.year}</p>
          </div>
        </div>
      </PageWrapper>

      {/* FOLHA DE ROSTO - Não conta na numeração */}
      <PageWrapper>
        <div className="flex flex-col h-full items-center justify-between py-4">
          <div className="uppercase font-bold text-center">{work.author}</div>
          <div className="flex flex-col items-center space-y-8 w-full">
            <div className="uppercase font-bold text-center text-2xl">{work.title}</div>
            <div className="ml-auto w-[100mm] text-sm text-justify leading-tight italic opacity-80">
              {work.type} apresentado ao curso de {work.course} da {work.institution} como requisito parcial para obtenção de grau académico.
            </div>
          </div>
          <div className="text-center uppercase font-bold">
            <p>{work.city}</p>
            <p>{work.year}</p>
          </div>
        </div>
      </PageWrapper>

      {/* INTRODUÇÃO - Inicia numeração (Pág 3) */}
      <PageWrapper pageNum={3}>
        <div className="w-full">
          <h2 className="uppercase font-bold mb-8">1 INTRODUÇÃO</h2>
          <div className={`abnt-indent leading-[1.5] ${!isPaid ? 'blur-[1px] select-none' : ''}`}>
            {work.content.introducao}
          </div>
        </div>
      </PageWrapper>

      {/* DESENVOLVIMENTO */}
      <PageWrapper pageNum={4}>
        <div className="w-full">
          <h2 className="uppercase font-bold mb-8">2 DESENVOLVIMENTO</h2>
          <div className={`abnt-indent leading-[1.5] ${!isPaid ? 'blur-[2px] select-none' : ''}`}>
            {work.content.desenvolvimento}
          </div>
          {!isPaid && (
            <div className="mt-12 p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
              Conteúdo completo bloqueado. Efectue o pagamento para visualizar.
            </div>
          )}
        </div>
      </PageWrapper>

      {/* REFERÊNCIAS */}
      <PageWrapper pageNum={5}>
        <div className="w-full">
          <h2 className="uppercase font-bold text-center mb-12">REFERÊNCIAS</h2>
          <div className="space-y-4 text-[12pt] academic-font">
            {work.content.referencias.split('\n').map((ref, i) => (
              <p key={i} className={!isPaid && i > 1 ? 'blur-[3px]' : ''}>{ref}</p>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};
