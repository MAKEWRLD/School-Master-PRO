import { GoogleGenAI, Type } from "@google/genai";
import { WorkType } from "../types";

// Fix: Removed top-level client initialization to follow SDK guidelines

export const generateAcademicContent = async (params: {
  title: string;
  type: WorkType;
  institution: string;
  course: string;
  author: string;
  city: string;
  tone: string;
}) => {
  // Fix: Initializing GoogleGenAI right before use with direct process.env.API_KEY reference
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Gere um trabalho académico completo para o tema: "${params.title}".
    Tipo de trabalho: ${params.type}.
    Instituição: ${params.institution}.
    Curso: ${params.course}.
    Autor: ${params.author}.
    Cidade: ${params.city}.
    Tom: ${params.tone}.
    
    O trabalho deve seguir rigorosamente as normas ABNT.
    Forneça o conteúdo estruturado em: Capa, Folha de Rosto, Introdução, Desenvolvimento (com subtítulos se necessário), Conclusão e Referências Bibliográficas (em formato ABNT).
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

    // Fix: Accessing .text property directly (already correct in logic, but ensuring it returns string)
    const result = response.text || '{}';
    return JSON.parse(result);
  } catch (error) {
    console.error("Erro ao gerar conteúdo Gemini:", error);
    throw error;
  }
};