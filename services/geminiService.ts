import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeProject = async (project: Project): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Cannot perform AI analysis.";
  }

  try {
    const totalCost = project.costs.material + project.costs.labor + project.costs.equipment;
    
    const prompt = `
      Atue como um especialista em engenharia civil e gestão de custos.
      Analise os dados desta obra da GP7 Distribuidora:
      
      Título: ${project.title}
      Descrição: ${project.description}
      Status: ${project.status}
      Empresa Contratada: ${project.contractor.name} (CNPJ: ${project.contractor.cnpj})
      
      Custos:
      - Material: R$ ${project.costs.material}
      - Mão-de-obra: R$ ${project.costs.labor}
      - Equipamentos: R$ ${project.costs.equipment}
      - TOTAL: R$ ${totalCost}
      
      Forneça um breve parágrafo (máximo 50 palavras) com um insight sobre a proporção dos custos e se parecem adequados para o tipo de obra descrito. Seja direto e profissional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA para análise.";
  }
};