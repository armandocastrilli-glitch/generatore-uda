
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ESTRAZIONE DATI (Sistemati i nomi che nel PDF avevano spazi)
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera,
      metodologie, prodotti, traguardiScelti 
    } = body;

    const apiKey = process.env.GROQ_API_KEY; // Se funzionava ieri, la chiave è già nelle impostazioni del tuo server

    if (!apiKey) {
      return NextResponse.json({ error: "API Key non trovata" }, { status: 500 });
    }

    let prompt = "";

    if (tipoRichiesta === "UDA_COMPLETA") {
      prompt = `
Agisci come un Esperto Progettista Didattico dell'IC Bursi.
Genera l'UDA "${titolo}" per classe ${classe}ª ${scuola}.

DATI:
- Materie: ${materie?.join(", ")}
- Ore: ${ore} | Periodo: ${periodo}
- Traguardi: ${traguardiScelti?.join(" | ")}
- Metodologie: ${metodologie || "Didattica attiva"}
- Prodotto: ${prodotti || "Compito di realtà"}
- Note: ${descrizioneLibera}

REGOLE FORMATTAZIONE:
Usa i tag: [CONTESTO], [CONSEGNA], [TRAGUARDI], [PRODOTTO], [PIANO_LAVORO], [VALUTAZIONE].
Nel PIANO_LAVORO usa: FASE: | MATERIE: | DESCRIZIONE: | METODI: | VALUTAZIONE: | ORE:
`;
    } else {
      prompt = `Genera 3 proposte UDA per "${titolo}". 
      Classe ${classe}ª, Materie: ${materie?.join(", ")}.
      Metodologie: ${metodologie}. Prodotto: ${prodotti}.
      Rispondi in JSON: {"proposte": ["...", "...", "..."]}`;
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
          { role: "system", content: "Sei il generatore ufficiale di UDA dell'IC Bursi." },
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
    console.error("ERRORE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
