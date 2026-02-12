import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Chiamata diretta all'indirizzo REST di Google (senza usare la libreria problematica)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sei un esperto di didattica. Genera un'UDA per l'IC "F. Bursi". 
                     Titolo: ${titolo}, Classe: ${classe}, Materie: ${materie.join(", ")}. 
                     Includi: Competenze, Obiettivi, Fasi e Griglia di valutazione.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    console.error("ERRORE:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
