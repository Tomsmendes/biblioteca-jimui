
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateBookSummary(title: string, author: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um resumo curto e instigante em português para o livro "${title}" do autor "${author}".`,
    });
    return response.text || "Resumo não disponível no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao gerar resumo automático.";
  }
}

export async function getBookRecommendations(favoriteBooks: string[]): Promise<string[]> {
  if (favoriteBooks.length === 0) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base nestes livros favoritos: ${favoriteBooks.join(', ')}, sugira 3 outros títulos que o usuário possa gostar. Retorne apenas os nomes dos livros separados por vírgula.`,
    });
    return response.text?.split(',').map(s => s.trim()) || [];
  } catch (error) {
    return [];
  }
}
