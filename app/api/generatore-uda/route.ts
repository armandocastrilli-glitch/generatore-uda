import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inizializzazione della chiave API
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    // 1. Controllo esistenza chiave API
    if (!apiKey) {
      console.error("ERRORE: GOOGLE_GENERATIVE_AI_API_KEY non configurata su Vercel.");
      return NextResponse.json(
        { error: "Configurazione mancante: inserisci la API Key su Vercel." },
        { status: 500 }
      );
    }

    // 2. Ricezione dati dal frontend
    const { titolo, classe, periodo, ore, materie } = await req.json();

    // 3. Configurazione Modello (FORZATA VERSIONE v1)
    // Questo risolve l'errore 404 "models/gemini-1.5-flash is not found for API version v1beta"
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );

    // 4. Definizione del Prompt
    const prompt = `Sei un esperto di didattica italiana e legislazione scolastica. 
    Genera una Unità di Apprendimento (UDA) completa per la scuola secondaria di primo grado, basata sul modello dell'IC "F. Bursi".
    
    DATI:
    - Titolo: ${titolo}
    - Classe: ${classe}ª
    - Periodo: ${periodo}
    - Ore totali: ${ore}
    - Materie coinvolte: ${materie.join(", ")}

    STRUTTURA RICHIESTA:
    1. Competenze chiave europee.
    2. Traguardi per lo sviluppo delle competenze.
    3. Obiettivi di apprendimento (conoscenze e abilità).
    4. Tabella delle fasi di lavoro (Fase, Attività, Metodologia, Ore).
    5. Metodologie e Griglia di valutazione.

    Usa Markdown per la formattazione.`;

    // 5. Generazione contenuto
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Risposta al frontend
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    // Log dettagliato per il debug in Vercel
    console.error("ERRORE CRITICO GEMINI:", error.message || error);

    return NextResponse.json(
      { 
        error: "L'AI non ha risposto correttamente.", 
        dettaglio: error.message 
      },
      { status: 500 }
    );
  }
}
