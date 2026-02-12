import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = "AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY"; 

    // CAMBIAMO DA v1beta A v1 (VERSIONE STABILE)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Genera UDA: ${titolo}, Classe: ${classe}, Materie: ${materie.join(", ")}.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      // Questo log apparirà su Vercel e ci dirà il motivo REALE (es. PERMISSION_DENIED)
      console.error("ERRORE CRITICO GOOGLE:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ uda: data.candidates[0].content.parts[0].text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
