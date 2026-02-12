import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // URL AGGIORNATO: Usiamo gemini-1.5-flash (il modello gratuito attuale)
    // E la versione v1 (non beta) per massima stabilità
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sei un esperto di didattica italiana. Genera una Unità di Apprendimento (UDA) per una scuola secondaria di primo grado (IC "F. Bursi").
                     Titolo: ${titolo}
                     Classe: ${classe}ª
                     Materie: ${materie.join(", ")}
                     Includi: Competenze chiave, Traguardi, Obiettivi, Fasi di lavoro e Griglia di valutazione.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    // Gestione degli errori specifica
    if (data.error) {
      throw new Error(`${data.error.status}: ${data.error.message}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Google non ha restituito alcun contenuto. Controlla la sicurezza del prompt.");
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    console.error("ERRORE FINALE:", error.message);
    return NextResponse.json({ 
      error: "Problema con Google Gemini", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
