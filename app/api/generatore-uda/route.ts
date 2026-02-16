import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Estrazione dati con nomi corretti (senza spazi)
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera,
      metodologie, prodotti, traguardiScelti 
    } = body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Manca GROQ_API_KEY nel file .env" }, { status: 500 });
    }

    let prompt = "";

    if (tipoRichiesta === "UDA_COMPLETA") {
      prompt = `Genera UDA: ${titolo}. Classe: ${classe}. Materie: ${materie?.join(", ")}. 
      Metodologie: ${metodologie || "Attive"}. Prodotto: ${prodotti || "Concreto"}. 
      Note: ${descrizioneLibera}. Traguardi: ${traguardiScelti?.join(" | ")}.
      Usa i tag obbligatori: [CONTESTO], [CONSEGNA], [TRAGUARDI], [PRODOTTO], [PIANO_LAVORO], [VALUTAZIONE].`;
    } else {
      prompt = `Genera 3 proposte UDA per "${titolo}" in formato JSON: {"proposte": ["1", "2", "3"]}`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sei un esperto dell'IC Bursi." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: tipoRichiesta === "UDA_COMPLETA" ? { type: "text" } : { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: data.choices[0].message.content });
    } else {
      const content = JSON.parse(data.choices[0].message.content);
      return NextResponse.json({ proposte: content.proposte });
    }

  } catch (error: any) {
    console.error("CRASH SERVER:", error);
    return NextResponse.json({ error: "Errore interno al server" }, { status: 500 });
  }
}
