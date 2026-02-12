import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inizializziamo l'API di Google fuori dalla funzione per efficienza
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    // 1. Verifica immediata della chiave
    if (!apiKey) {
      console.error("ERRORE: La variabile GOOGLE_GENERATIVE_AI_API_KEY non è impostata su Vercel.");
      return NextResponse.json(
        { error: "Configurazione mancante: chiave API non trovata." },
        { status: 500 }
      );
    }

    // 2. Lettura dei dati inviati dal modulo
    const { titolo, classe, periodo, ore, materie } = await req.json();

    // 3. Selezione del modello (Gemini 1.5 Flash è gratuito e veloce)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Creazione del Prompt specifico per l'IC "F. Bursi"
    const prompt = `Sei un esperto di didattica italiana e legislazione scolastica. 
    Genera una Unità di Apprendimento (UDA) completa per la scuola secondaria di primo grado, basata sul modello dell'IC "F. Bursi".
    
    DATI DI BASE:
    - Titolo: ${titolo}
    - Classe: ${classe}ª
    - Periodo: ${periodo}
    - Ore totali: ${ore}
    - Materie coinvolte: ${materie.join(", ")}

    STRUTTURA RICHIESTA:
    1. Competenze chiave europee coinvolte.
    2. Traguardi per lo sviluppo delle competenze (dalle Indicazioni Nazionali).
    3. Obiettivi di apprendimento (conoscenze e abilità).
    4. Tabella delle fasi di lavoro (Fase, Attività, Metodologia, Ore).
    5. Prodotti finali attesi.
    6. Griglia di valutazione con descrittori (Avanzato, Intermedio, Base, Iniziale).

    Usa un tono professionale e formattazione chiara in Markdown.`;

    // 5. Generazione del contenuto
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Invio della risposta al frontend
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    // Questo log apparirà nella tab "Logs" di Vercel in rosso
    console.error("ERRORE CRITICO GEMINI:", error.message || error);

    return NextResponse.json(
      { 
        error: "Errore durante la generazione dell'UDA.",
        dettaglio: error.message 
      },
      { status: 500 }
    );
  }
}
