import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Sei un esperto di didattica italiana. Genera una Unità di Apprendimento (UDA) per una scuola secondaria di primo grado, modello IC "F. Bursi".
    Titolo: ${titolo}
    Classe: ${classe}ª
    Periodo: ${periodo}
    Ore totali: ${ore}
    Materie coinvolte: ${materie.join(", ")}

    L'UDA deve contenere:
    1. Competenze chiave europee.
    2. Traguardi di competenza.
    3. Obiettivi di apprendimento.
    4. Tabella con le fasi di lavoro.
    5. Metodologie e Griglia di valutazione.
    Usa un formato chiaro e professionale.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ uda: text });
  } catch (error) {
    return NextResponse.json({ error: "Errore durante la generazione" }, { status: 500 });
  }
}