import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = "AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY"; 

    // VERSION v1beta + MODELLO -latest (La combinazione più potente e compatibile)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sei un esperto di didattica. Genera un'UDA per l'IC "F. Bursi". Titolo: ${titolo}, Classe: ${classe}, Materie: ${materie.join(", ")}.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("ERRORE DIRETTO:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ uda: data.candidates[0].content.parts[0].text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
