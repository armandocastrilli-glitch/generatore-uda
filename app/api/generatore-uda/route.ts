import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // Inizializziamo l'SDK con la tua chiave
    // Usiamo l'SDK ufficiale che gestisce internamente il routing v1/v1beta
    const genAI = new GoogleGenerativeAI("AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY");
    
    // Specifichiamo il modello senza prefissi di versione, l'SDK farà il resto
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Sei un esperto di didattica per la scuola secondaria di primo grado italiana. 
    Genera un'Unità di Apprendimento (UDA) per l'IC "F. Bursi" di Fiorano Modenese.
    
    DATI:
    - Titolo: ${titolo}
    - Classe: ${classe}ª
    - Periodo: ${periodo}
    - Ore previste: ${ore}
    - Materie coinvolte: ${materie.join(", ")}
    
    L'UDA deve includere: Competenze chiave europee, Traguardi di competenza, Obiettivi di apprendimento, 
    una Tabella con le fasi di lavoro e una Griglia di valutazione. Usa Markdown per la formattazione.`;

    // Esecuzione della generazione
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Risposta al front-end
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    // Questo log apparirà su Vercel se l'SDK fallisce
    console.error("ERRORE SDK GOOGLE:", error.message);
    
    return NextResponse.json({ 
      error: "Errore durante la generazione con SDK", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
