import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // TORNIAMO ALLA v1beta MA CON IL MODELLO FLASH-8B (PIÙ COMPATIBILE)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      // Se fallisce ancora, proviamo a usare il modello gemini-pro (senza 1.5)
      throw new Error(`${data.error.status}: ${data.error.message}`);
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    return NextResponse.json({ error: "Errore Google", dettaglio: error.message }, { status: 500 });
  }
}
