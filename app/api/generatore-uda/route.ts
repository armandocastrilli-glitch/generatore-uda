import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // USIAMO LA VERSIONE v1 (STABILE) E IL MODELLO GEMINI-PRO
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Genera una Unità di Apprendimento (UDA) completa. 
                     Titolo: ${titolo}, Classe: ${classe}, Materie: ${materie.join(", ")}. 
                     Includi: Competenze, Obiettivi, Fasi e Valutazione.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    // Se Google restituisce un errore, lo leggiamo qui
    if (data.error) {
      throw new Error(data.error.message);
    }

    // Estraiamo il testo correttamente per il modello Pro
    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    console.error("ERRORE DEFINITIVO:", error.message);
    return NextResponse.json({ 
      error: "Errore di connessione a Google", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
