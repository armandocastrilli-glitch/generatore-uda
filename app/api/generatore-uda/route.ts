import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Estraiamo i dati dal body
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera 
    } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key mancante" }, { status: 500 });
    }

    let prompt = "";

    // GESTIONE DEI DUE TIPI DI RICHIESTA
    if (tipoRichiesta === "UDA_COMPLETA") {
      prompt = `Sei un esperto pedagogista dell'IC Bursi. 
      SVILUPPA UN'UDA COMPLETA basata su questa idea scelta: "${propostaScelta}".
      
      DATI DI CONTESTO:
      - Titolo: ${titolo}
      - Ordine: ${scuola}
      - Classe: ${classe}ª
      - Materie: ${materie?.join(", ")}
      - Ore: ${ore}
      - Periodo: ${periodo}
      
      STRUTTURA RICHIESTA:
      1. Introduzione e Motivazione
      2. Competenze Chiave Europee coinvolte
      3. Traguardi di competenza e Obiettivi di apprendimento
      4. Fasi di lavoro dettagliate (Metodologia)
      5. Prodotto finale e Modalità di Verifica/Valutazione.
      
      Usa un linguaggio professionale e formatta in Markdown (usa grassetti e titoli).`;
    } else {
      prompt = `Genera 3 proposte sintetiche e diverse per un'UDA scolastica (IC Bursi).
      Dati: Titolo "${titolo}", Scuola ${scuola}, Classe ${classe}ª, Materie: ${materie?.join(", ")}.
      Note aggiuntive del docente: ${descrizioneLibera || "Nessuna"}.
      
      IMPORTANTE: Rispondi ESCLUSIVAMENTE con un oggetto JSON valido con questo formato:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}
      Non aggiungere altro testo prima o dopo il JSON.`;
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
          { role: "system", content: "Sei un assistente didattico esperto che lavora per l'Istituto Comprensivo F. Bursi." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        // Se chiediamo l'UDA completa vogliamo testo, se chiediamo le proposte vogliamo JSON
        response_format: tipoRichiesta === "UDA_COMPLETA" ? { type: "text" } : { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: data.choices[0].message.content });
    } else {
      // Per le proposte, facciamo il parsing del JSON restituito dall'AI
      const content = JSON.parse(data.choices[0].message.content);
      return NextResponse.json({ proposte: content.proposte });
    }

  } catch (error: any) {
    console.error("ERRORE API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
