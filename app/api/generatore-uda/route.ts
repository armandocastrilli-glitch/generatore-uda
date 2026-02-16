import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. ESTRAZIONE DATI - Qui c'erano gli errori (spazi nei nomi)
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera,
      metodologie, prodotti, traguardiScelti 
    } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key mancante sul server" }, { status: 500 });
    }

    let prompt = "";

    // 2. LOGICA UDA COMPLETA
    if (tipoRichiesta === "UDA_COMPLETA") {
      prompt = `
Agisci come un Esperto Progettista Didattico dell'IC Bursi. 
DEVI generare i contenuti per l'UDA intitolata "${titolo}" rispettando i vincoli forniti.

DATI TECNICI:
- Ordine: ${scuola} | Classe: ${classe}ª
- Materie: ${materie?.join(", ")}
- Ore: ${ore} | Periodo: ${periodo}
- Traguardi scelti: ${traguardiScelti?.join(" | ")}

VINCOLI DOCENTE:
- METODOLOGIE: ${metodologie || "Didattica attiva e collaborativa"}
- PRODOTTO FINALE: ${prodotti || "Output concreto"}
- NOTE: ${descrizioneLibera || "Nessuna"}

REGOLE DI FORMATTAZIONE:
L'output deve essere diviso dai seguenti tag: [CONTESTO], [CONSEGNA], [TRAGUARDI], [PRODOTTO], [PIANO_LAVORO], [VALUTAZIONE].

Nel [PIANO_LAVORO] usa rigorosamente questo formato per ogni riga:
FASE: 1 | MATERIE: ... | DESCRIZIONE: ... | METODI: ${metodologie} | VALUTAZIONE: ... | ORE: ...
`;
    } 
    // 3. LOGICA PROPOSTE
    else {
      prompt = `Genera 3 proposte sintetiche per un'UDA dell'IC Bursi.
      Dati: Titolo "${titolo}", Classe ${classe}ª, Materie: ${materie?.join(", ")}.
      Note: ${descrizioneLibera}. Metodologie: ${metodologie}. Prodotto: ${prodotti}.
      
      Rispondi ESCLUSIVAMENTE con un oggetto JSON:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}`;
    }

    // 4. CHIAMATA A GROQ (Corrette le virgolette Authorization)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sei il generatore ufficiale di UDA dell'IC F. Bursi." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: tipoRichiesta === "UDA_COMPLETA" ? { type: "text" } : { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("Risposta vuota dall'IA");
    }

    const content = data.choices[0].message.content;

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: content });
    } else {
      const parsed = JSON.parse(content);
      return NextResponse.json({ proposte: parsed.proposte });
    }

  } catch (error: any) {
    console.error("ERRORE SERVER:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
