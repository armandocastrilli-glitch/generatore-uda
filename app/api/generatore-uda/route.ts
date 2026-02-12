import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
// FORZIAMO LA VERSIONE V1 QUI NELL'INIZIALIZZAZIONE
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Chiave API mancante" }, { status: 500 });
    }

    const { titolo, classe, periodo, ore, materie } = await req.json();

    // CAMBIAMO IL MODELLO IN gemini-1.5-pro CHE È PIÙ STABILE SUI PERCORSI V1
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-pro" },
      { apiVersion: "v1" }
    );

    const prompt = `Sei un esperto di didattica italiana. Genera una Unità di Apprendimento (UDA) per una scuola secondaria di primo grado (IC "F. Bursi").
    Titolo: ${titolo}
    Classe: ${classe}ª
    Periodo: ${periodo}
    Ore totali: ${ore}
    Materie: ${materie.join(", ")}
    Includi: Competenze, Traguardi, Obiettivi, Fasi di lavoro e Griglia di valutazione.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ uda: response.text() });

  } catch (error: any) {
    console.error("ERRORE CRITICO GEMINI:", error.message);
    return NextResponse.json({ 
      error: "Errore durante la generazione", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
