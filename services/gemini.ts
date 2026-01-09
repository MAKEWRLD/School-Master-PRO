
import { GoogleGenAI, Type } from "@google/genai";
import { WorkType, AcademicNorm } from "../types";

export const generateAcademicContent = async (params: {
  title: string;
  type: WorkType;
  institution: string;
  course: string;
  author: string;
  city: string;
  tone: string;
  norm: AcademicNorm;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    ATUE COMO UM DOUTOR ACADÉMICO SÉNIOR ESPECIALISTA EM NORMAS ABNT (NBR 14724, 6023, 10520).
    TEMA: "${params.title}"
    TIPO: ${params.type}
    INSTITUIÇÃO: ${params.institution}
    AUTOR: ${params.author}

    REQUISITOS OBRIGATÓRIOS:
    1. INTRODUÇÃO: Mínimo 3 parágrafos com justificativa e metodologia.
    2. DESENVOLVIMENTO: Divida em pelo menos 2 seções numeradas (Ex: 2 FUNDAMENTAÇÃO, 3 ANÁLISE). Inclua citações bibliográficas.
    3. RESUMO: Texto em parágrafo único, de 150 a 500 palavras.
    4. ABSTRACT: Versão em inglês técnico do resumo.
    5. REFERÊNCIAS: Mínimo 6 fontes reais formatadas conforme NBR 6023.

    ESTRUTURA DE RESPOSTA (JSON estrito):
    {
      "capa": { "instituicao": "...", "autor": "...", "titulo": "...", "cidade": "...", "ano": "..." },
      "resumo": "...",
      "abstract": "...",
      "introducao": "...",
      "desenvolvimento": [
        { "title": "2 FUNDAMENTAÇÃO TEÓRICA", "content": "..." },
        { "title": "3 RESULTADOS E DISCUSSÃO", "content": "..." }
      ],
      "conclusao": "...",
      "referencias": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            capa: {
              type: Type.OBJECT,
              properties: {
                instituicao: { type: Type.STRING },
                autor: { type: Type.STRING },
                titulo: { type: Type.STRING },
                cidade: { type: Type.STRING },
                ano: { type: Type.STRING }
              },
              required: ["instituicao", "autor", "titulo", "cidade", "ano"]
            },
            resumo: { type: Type.STRING },
            abstract: { type: Type.STRING },
            introducao: { type: Type.STRING },
            desenvolvimento: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            },
            conclusao: { type: Type.STRING },
            referencias: { type: Type.STRING }
          },
          required: ["capa", "resumo", "abstract", "introducao", "desenvolvimento", "conclusao", "referencias"]
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro na geração de IA:", error);
    throw error;
  }
};
