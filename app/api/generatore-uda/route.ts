import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. ESTRAZIONE DATI (Corretti i nomi che nel PDF avevano spazi)
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

    // 2. LOGICA SVILUPPO UDA COMPLETA (Mantenuti tutti i tuoi TAG)
    if (tipoRichiesta === "UDA_COMPLETA") {
      prompt = `
Agisci come un Esperto Progettista Didattico dell'IC Bursi.
Genera i contenuti per l'UDA "${titolo}" per una classe ${classe}ª ${scuola}.

DATI TECNICI:
- Materie: ${materie?.join(", ")}
- Ore: ${ore} | Periodo: ${periodo}
- Traguardi: ${traguardiScelti?.join(" | ")}

VINCOLI DOCENTE:
- Metodologie: ${metodologie || "Didattica attiva"}
- Prodotto: ${prodotti || "Compito di realtà"}
- Note: ${descrizioneLibera}

REGOLE DI FORMATTAZIONE (OBBLIGATORIE):
Usa esattamente questi tag:

[CONTESTO]
Crea una Situazione-Problema stimolante.

[CONSEGNA]
Definisci il compito di realtà.

[TRAGUARDI]
Elenca: ${traguardiScelti?.join(" | ")}.

[PRODOTTO]
Descrivi il prodotto finale tangibile: ${prodotti}.

[PIANO_LAVORO]
Scansione temporale di ${ore} ore. Formato obbligatorio per ogni riga:
FASE: 1 | MATERIE: ... | DESCRIZIONE: ... | METODI: ${metodologie} | VALUTAZIONE: ... | ORE: ...

[VALUTAZIONE]
Specifica l'uso delle griglie d'Istituto (Prerequisiti, Processo, Prodotto, Competenze).
`;
    } 
    // 3. LOGICA GENERAZIONE 3 PROPOSTE (FASE 1)
    else {
      prompt = `Genera 3 proposte sintetiche per un'UDA dell'IC Bursi.
      Titolo: "${titolo}", Classe: ${classe}ª, Materie: ${materie?.join(", ")}.
      Note: ${descrizioneLibera}. Metodologie: ${metodologie}. Prodotto: ${prodotti}.
      Rispondi ESCLUSIVAMENTE con un oggetto JSON:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}`;
    }

    // 4. CHIAMATA AL SERVER GROQ
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

    // Gestione errori risposta
    if (!data.choices || data.choices.length === 0) {
      throw new Error("L'IA non ha risposto correttamente.");
    }

    const content = data.choices[0].message.content;

    // 5. INVIO AL FRONTEND
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
