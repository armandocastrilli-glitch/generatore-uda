import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
// Forziamo l'inizializzazione con la versione stabile v1
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API Key mancante su Vercel" }, { status: 500 });
    }

    const { titolo, classe, periodo, ore, materie } = await req.json();

    // Specifichiamo esplicitamente la versione stabile 'v1'
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );

    const prompt = `Sei un esperto di didattica. Genera un'UDA per l'IC "F. Bursi".
    Titolo: ${titolo}
    Classe: ${classe}ª
    Materie: ${materie.join(", ")}
    Includi: Competenze, Traguardi, Obiettivi e Griglia di valutazione.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ uda: text });
  } catch (error: any) {
    console.error("ERRORE CRITICO GEMINI:", error.message);
    return NextResponse.json({ 
      error: "Errore AI", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
