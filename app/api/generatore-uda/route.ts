import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inizializzazione della chiave API dalle variabili d'ambiente di Vercel
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    // 1. Controllo di sicurezza sulla chiave API
    if (!apiKey) {
      console.error("ERRORE: Variabile GOOGLE_GENERATIVE_AI_API_KEY non trovata su Vercel.");
      return NextResponse.json(
        { error: "Configurazione mancante sul server." },
        { status: 500 }
      );
    }

    // 2. Recupero dei dati inviati dal frontend
    const { titolo, classe, periodo, ore, materie } = await req.json();

    // 3. Configurazione del modello
    // Usiamo "gemini-1.5-flash" che è la versione più aggiornata e compatibile
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Costruzione del Prompt per l'IC "F. Bursi"
    const prompt = `Sei un esperto di didattica italiana. 
    Genera una Unità di Apprendimento (UDA) per una scuola secondaria di primo grado, seguendo lo stile dell'IC "F. Bursi".
    
    PARAMETRI:
    - TITOLO: ${titolo}
    - CLASSE: ${classe}ª
    - PERIODO: ${periodo}
    - ORE: ${ore}
    - MATERIE: ${materie.join(", ")}

    STRUTTURA RICHIESTA:
    1. Competenze chiave europee.
    2. Traguardi di competenza dalle Indicazioni Nazionali.
    3. Obiettivi di apprendimento (Conoscenze e Abilità).
    4. Tabella con le fasi di lavoro.
    5. Metodologie e Griglia di valutazione.
    
    Usa un formato Markdown chiaro e professionale.`;

    // 5. Richiesta di generazione a Google Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Restituzione del risultato al sito
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    // Questo log apparirà in rosso nei log di Vercel per aiutarci nel debug
    console.error("ERRORE CRITICO GEMINI:", error.message);

    return NextResponse.json(
      { 
        error: "L'AI non ha risposto correttamente.",
        dettaglio: error.message 
      },
      { status: 500 }
    );
  }
}
