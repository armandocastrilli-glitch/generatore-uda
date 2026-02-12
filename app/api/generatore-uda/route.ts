import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // CHIAVE INSERITA DIRETTAMENTE PER BYPASSARE I PROBLEMI DI VERCEL
    const apiKey = "AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY"; 

    // Usiamo l'endpoint v1beta che è quello che ti ha risposto nel Playground
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sei un esperto di didattica italiana. Genera una Unità di Apprendimento (UDA) per una scuola secondaria di primo grado (IC "F. Bursi").
                     TITOLO: ${titolo}
                     CLASSE: ${classe}ª
                     PERIODO: ${periodo}
                     ORE: ${ore}
                     MATERIE: ${materie.join(", ")}
                     L'UDA deve contenere: Competenze chiave, Traguardi, Obiettivi, Tabella fasi di lavoro e Griglia di valutazione. Usa Markdown.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Estrazione del testo della risposta
    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    console.error("ERRORE:", error.message);
    return NextResponse.json({ 
      error: "Errore durante la generazione", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
