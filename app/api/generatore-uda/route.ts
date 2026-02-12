import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // USIAMO IL MODELLO 1.0 PRO - IL PIÙ COMPATIBILE AL MONDO
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sei un esperto di didattica. Genera un'UDA completa. Titolo: ${titolo}, Classe: ${classe}, Materie: ${materie.join(", ")}.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      // Se fallisce anche questo, il problema è la chiave API non attiva
      throw new Error(`Errore Google: ${data.error.message}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    console.error("ERRORE:", error.message);
    return NextResponse.json({ 
      error: "Errore di generazione", 
      dettaglio: error.message 
    }, { status: 500 });
  }
}
