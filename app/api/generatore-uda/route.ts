import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inizializzazione della chiave API prelevata dalle variabili d'ambiente di Vercel
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  try {
    // 1. Controllo di sicurezza: la chiave API è presente?
    if (!apiKey) {
      return NextResponse.json(
        { error: "Configurazione mancante: la chiave API non è stata trovata su Vercel." },
        { status: 500 }
      );
    }

    // 2. Ricezione dei dati dal modulo del tuo sito
    const { titolo, classe, periodo, ore, materie } = await req.json();

    // 3. Selezione del modello specifico (usiamo il nome più stabile)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Definizione del prompt per l'UDA
    const prompt = `Sei un esperto di didattica italiana. 
    Genera una Unità di Apprendimento (UDA) per una scuola secondaria di primo grado, seguendo lo schema dell'IC "F. Bursi".
    
    PARAMETRI:
    - Titolo: ${titolo}
    - Classe: ${classe}ª
    - Periodo: ${periodo}
    - Ore: ${ore}
    - Materie: ${materie.join(", ")}

    L'UDA deve includere:
    1. Competenze chiave europee.
    2. Traguardi di competenza.
    3. Obiettivi di apprendimento.
    4. Tabella con le fasi di lavoro (Attività, Metodologie, Ore).
    5. Griglia di valutazione.
    
    Usa un formato Markdown professionale.`;

    // 5. Chiamata a Gemini per generare il testo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Restituzione del risultato al frontend
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    // Log dell'errore per il debug nei log di Vercel
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
