import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. ESTRAZIONE DATI (Sistemati i nomi che avevano spazi: ora sono identici al frontend)
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera,
      metodologie, prodotti, traguardiScelti 
    } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key mancante" }, { status: 500 });
    }

    let prompt = "";

    if (tipoRichiesta === "UDA_COMPLETA") {
      prompt = `
Agisci come un Esperto Progettista Didattico dell'IC Bursi.
DEVI generare i contenuti per l'UDA intitolata "${titolo}" rispettando rigorosamente i vincoli forniti.

DATI TECNICI:
- Scuola: ${scuola} | Classe: ${classe}ª
- Materie: ${materie?.join(", ")}
- Ore: ${ore} | Periodo: ${periodo}
- Traguardi scelti: ${traguardiScelti?.join(" | ")}

VINCOLI DIDATTICI SPECIFICI:
- METODOLOGIE: ${metodologie || "Didattica attiva"}
- PRODOTTO FINALE: ${prodotti || "Output concreto"}
- NOTE: ${descrizioneLibera}

REGOLE DI FORMATTAZIONE:
L'output deve essere diviso dai tag: [CONTESTO], [CONSEGNA], [TRAGUARDI], [PRODOTTO], [PIANO_LAVORO], [VALUTAZIONE].

Nel [PIANO_LAVORO] ogni riga deve seguire questo formato:
FASE: 1 | MATERIE: ... | DESCRIZIONE: ... | METODI: ${metodologie} | VALUTAZIONE: ... | ORE: ...
`;
    } else {
      prompt = `Genera 3 proposte sintetiche per un'UDA dell'IC Bursi.
      Dati: Titolo "${titolo}", Classe ${classe}ª, Materie: ${materie?.join(", ")}.
      Note: ${descrizioneLibera}. Metodologie: ${metodologie}. Prodotto: ${prodotti}.
      Rispondi ESCLUSIVAMENTE con un oggetto JSON:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}`;
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
          { role: "system", content: `Sei il generatore ufficiale di UDA dell'IC F. Bursi. Classe ${classe}ª ${scuola}.` },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: tipoRichiesta === "UDA_COMPLETA" ? { type: "text" } : { type: "json_object" }
      }),
    });

    const data = await response.json();

    // Gestione errori e invio risposta
    if (!data.choices || data.choices.length === 0) {
       return NextResponse.json({ error: "Errore risposta IA" }, { status: 500 });
    }

    const content = data.choices[0].message.content;

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: content });
    } else {
      const parsed = JSON.parse(content);
      return NextResponse.json({ proposte: parsed.proposte });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
