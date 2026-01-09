
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
    ATUE COMO UM DOUTOR ACADÉMICO SÉNIOR ESPECIALISTA EM NORMAS INTERNACIONAIS.
    TEMA: "${params.title}"
    TIPO DE TRABALHO: ${params.type}
    NORMA ACADÉMICA: ${params.norm}
    TOM DE VOZ: ${params.tone}

    OBJETIVO: Gerar conteúdo original, profundo e estritamente formatado conforme a norma solicitada.

    ESTRUTURA DE RESPOSTA (JSON):
    1. INTRODUÇÃO: Contexto, tese central e objetivos.
    2. DESENVOLVIMENTO: Argumentação baseada em evidências, citações no estilo ${params.norm}.
    3. CONCLUSÃO: Síntese e recomendações.
    4. REFERÊNCIAS: Mínimo 5 fontes credíveis formatadas em ${params.norm}.

    IMPORTANTE: 
    - Se a norma for APA, use citações (Autor, Ano). 
    - Se for ABNT, use (AUTOR, ano).
    - Mantenha o tom ${params.tone} em todo o documento.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            capa: { type: Type.STRING },
            folhaRosto: { type: Type.STRING },
            introducao: { type: Type.STRING },
            desenvolvimento: { type: Type.STRING },
            conclusao: { type: Type.STRING },
            referencias: { type: Type.STRING },
          },
          required: ["capa", "folhaRosto", "introducao", "desenvolvimento", "conclusao", "referencias"]
        },
      },
    });

    const result = response.text || '{}';
    return JSON.parse(result);
  } catch (error) {
    console.error("Erro na geração de IA:", error);
    throw error;
  }
};
