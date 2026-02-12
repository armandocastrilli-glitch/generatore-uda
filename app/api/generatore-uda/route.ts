import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    const apiKey = "AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY"; 

    // USIAMO IL MODELLO STABILE (1.5-FLASH) INVECE DI QUELLO EXPERIMENTAL
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ uda: data.candidates[0].content.parts[0].text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
