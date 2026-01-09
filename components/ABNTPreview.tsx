
import React from 'react';
import { AcademicWork } from '../types';

interface ABNTPreviewProps {
  work: AcademicWork;
}

export const ABNTPreview: React.FC<ABNTPreviewProps> = ({ work }) => {
  return (
    <div className="space-y-8 overflow-x-auto bg-slate-200 p-4 rounded-lg">
      {/* CAPA */}
      <div className="abnt-page flex flex-col items-center">
        <div className="uppercase font-bold text-center mb-24">{work.institution}</div>
        <div className="uppercase font-bold text-center mb-48">{work.author}</div>
        <div className="uppercase font-bold text-center text-xl mb-auto">{work.title}</div>
        <div className="text-center mt-auto">
          <div className="uppercase font-bold">{work.city}</div>
          <div className="uppercase font-bold">{work.year}</div>
        </div>
      </div>

      {/* FOLHA DE ROSTO */}
      <div className="abnt-page flex flex-col items-center">
        <div className="uppercase font-bold text-center mb-24">{work.author}</div>
        <div className="uppercase font-bold text-center text-xl mb-12">{work.title}</div>
        
        <div className="ml-auto w-1/2 text-sm leading-tight mb-auto">
          {work.type} apresentado ao curso de {work.course} da {work.institution} como requisito parcial para obtenção de nota.
        </div>

        <div className="text-center mt-auto">
          <div className="uppercase font-bold">{work.city}</div>
          <div className="uppercase font-bold">{work.year}</div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="abnt-page">
        <div className="uppercase font-bold mb-4">1 INTRODUÇÃO</div>
        <div className="abnt-indent whitespace-pre-line">{work.content.introducao}</div>
      </div>

      <div className="abnt-page">
        <div className="uppercase font-bold mb-4">2 DESENVOLVIMENTO</div>
        <div className="abnt-indent whitespace-pre-line">{work.content.desenvolvimento}</div>
      </div>

      <div className="abnt-page">
        <div className="uppercase font-bold mb-4">3 CONCLUSÃO</div>
        <div className="abnt-indent whitespace-pre-line">{work.content.conclusao}</div>
      </div>

      <div className="abnt-page">
        <div className="uppercase font-bold text-center mb-8">REFERÊNCIAS</div>
        <div className="whitespace-pre-line text-sm">{work.content.referencias}</div>
      </div>
    </div>
  );
};
