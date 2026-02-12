import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // La tua chiave (già inserita)
    const apiKey = "AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY"; 

    // VIA ALTERNATIVA: Usiamo l'endpoint 'text-only' che è il più stabile
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Sei un esperto di didattica. Genera un'UDA per la scuola media. Titolo: ${titolo}, Classe: ${classe}, Materie: ${materie.join(", ")}.`
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
       // Se fallisce ancora, proviamo l'ULTIMISSIMO modello rimasto
       return NextResponse.json({ error: "Google rifiuta ancora la connessione", dettaglio: data.error.message }, { status: 500 });
    }

    const text = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    return NextResponse.json({ error: "Errore di sistema", dettaglio: error.message }, { status: 500 });
  }
}
