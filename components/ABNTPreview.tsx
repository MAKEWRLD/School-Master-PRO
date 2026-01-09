
import React from 'react';
import { AcademicWork, WorkStatus } from '../types';

interface ABNTPreviewProps {
  work: AcademicWork;
}

export const ABNTPreview: React.FC<ABNTPreviewProps> = ({ work }) => {
  const isPaid = work.status === WorkStatus.PAID || work.status === WorkStatus.READY;

  const PageWrapper: React.FC<{ children: React.ReactNode; pageNum?: number; hideNumber?: boolean }> = ({ children, pageNum, hideNumber }) => (
    <div className="relative abnt-page group mb-10 overflow-hidden">
      {!isPaid && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] select-none z-0">
          <span className="text-9xl font-black -rotate-45 uppercase whitespace-nowrap">RASCUNHO</span>
        </div>
      )}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
      {pageNum && !hideNumber && isPaid && (
        <div className="absolute top-[20mm] right-[20mm] text-[10pt] academic-font font-normal">
          {pageNum}
        </div>
      )}
    </div>
  );

  const { capa, resumo, abstract, introducao, desenvolvimento, conclusao, referencias } = work.content;

  return (
    <div className="flex flex-col items-center bg-slate-200/50 py-10 min-h-screen">
      {/* 1. CAPA */}
      <PageWrapper hideNumber>
        <div className="flex flex-col h-full items-center justify-between text-center uppercase font-bold">
          <div className="space-y-2">
            <p>{capa.instituicao}</p>
            <p className="text-sm font-normal">{work.course}</p>
          </div>
          <div className="mt-20">{capa.autor}</div>
          <div className="text-2xl max-w-lg mt-20">{capa.titulo}</div>
          <div className="mt-auto">
            <p>{capa.cidade}</p>
            <p>{capa.ano}</p>
          </div>
        </div>
      </PageWrapper>

      {/* 2. FOLHA DE ROSTO */}
      <PageWrapper hideNumber>
        <div className="flex flex-col h-full items-center justify-between uppercase font-bold">
          <div>{capa.autor}</div>
          <div className="flex flex-col items-center space-y-10 w-full">
            <div className="text-2xl text-center">{capa.titulo}</div>
            <div className="ml-auto w-[100mm] text-sm text-justify font-normal normal-case leading-tight italic opacity-90">
              {work.type} apresentado ao curso de {work.course} da {capa.instituicao} como requisito para obtenção de grau académico.
            </div>
          </div>
          <div className="text-center">
            <p>{capa.cidade}</p>
            <p>{capa.ano}</p>
          </div>
        </div>
      </PageWrapper>

      {/* 3. RESUMO */}
      <PageWrapper pageNum={3} hideNumber={!isPaid}>
        <h2 className="text-center font-bold mb-8">RESUMO</h2>
        <div className="text-justify leading-[1.5] mb-6">
          {resumo}
        </div>
        <p className="font-bold">Palavras-chave: <span className="font-normal italic">Educação, Tecnologia, Inovação.</span></p>
      </PageWrapper>

      {/* 4. ABSTRACT */}
      <PageWrapper pageNum={4} hideNumber={!isPaid}>
        <h2 className="text-center font-bold mb-8">ABSTRACT</h2>
        <div className="text-justify leading-[1.5] mb-6 italic">
          {abstract}
        </div>
        <p className="font-bold">Keywords: <span className="font-normal">Education, Technology, Innovation.</span></p>
      </PageWrapper>

      {/* 5. SUMÁRIO */}
      <PageWrapper pageNum={5} hideNumber={!isPaid}>
        <h2 className="text-center font-bold mb-10">SUMÁRIO</h2>
        <div className="space-y-2 uppercase font-bold text-sm">
          <div className="flex justify-between border-b border-dotted border-slate-300">
            <span>1 INTRODUÇÃO</span>
            <span>6</span>
          </div>
          {desenvolvimento.map((sec, idx) => (
            <div key={idx} className="flex justify-between border-b border-dotted border-slate-300">
              <span>{sec.title}</span>
              <span>{7 + idx}</span>
            </div>
          ))}
          <div className="flex justify-between border-b border-dotted border-slate-300">
            <span>CONCLUSÃO</span>
            <span>{6 + desenvolvimento.length + 1}</span>
          </div>
          <div className="flex justify-between border-b border-dotted border-slate-300">
            <span>REFERÊNCIAS</span>
            <span>{6 + desenvolvimento.length + 2}</span>
          </div>
        </div>
      </PageWrapper>

      {/* 6. INTRODUÇÃO */}
      <PageWrapper pageNum={6} hideNumber={!isPaid}>
        <h2 className="font-bold mb-8 uppercase">1 INTRODUÇÃO</h2>
        <div className={`abnt-indent text-justify ${!isPaid ? 'blur-[1px] select-none' : ''}`}>
          {introducao}
        </div>
      </PageWrapper>

      {/* 7. DESENVOLVIMENTO */}
      {desenvolvimento.map((sec, idx) => (
        <PageWrapper key={idx} pageNum={7 + idx} hideNumber={!isPaid}>
          <h2 className="font-bold mb-8 uppercase">{sec.title}</h2>
          <div className={`abnt-indent text-justify ${!isPaid ? 'blur-[3px] select-none' : ''}`}>
            {sec.content}
          </div>
          {!isPaid && (
            <div className="mt-10 p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 font-bold uppercase text-xs">
              Conteúdo PRO Bloqueado
            </div>
          )}
        </PageWrapper>
      ))}

      {/* CONCLUSÃO */}
      <PageWrapper pageNum={6 + desenvolvimento.length + 1} hideNumber={!isPaid}>
        <h2 className="font-bold mb-8 uppercase">CONCLUSÃO</h2>
        <div className={`abnt-indent text-justify ${!isPaid ? 'blur-[2px] select-none' : ''}`}>
          {conclusao}
        </div>
      </PageWrapper>

      {/* REFERÊNCIAS */}
      <PageWrapper pageNum={6 + desenvolvimento.length + 2} hideNumber={!isPaid}>
        <h2 className="text-center font-bold mb-12 uppercase">REFERÊNCIAS</h2>
        <div className="space-y-4 text-[11pt]">
          {referencias.split('\n').map((ref, i) => (
            <p key={i} className={`text-justify ${!isPaid && i > 1 ? 'blur-[4px]' : ''}`}>{ref}</p>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
};
