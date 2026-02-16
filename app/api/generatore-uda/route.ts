import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. ESTRAZIONE DATI AGGIORNATA (Aggiunti metodologie e prodotti)
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera,
      metodologie, // <-- Nuovo campo
      prodotti,    // <-- Nuovo campo
      traguardiScelti,
      istruzioniSviluppo 
    } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key mancante sul server" }, { status: 500 });
    }

    let prompt = "";

    if (tipoRichiesta === "UDA_COMPLETA") {
      const isCompilazioneDiretta = propostaScelta?.includes("COMPILAZIONE_DIRETTA");

      prompt = `
Agisci come un Esperto Progettista Didattico dell'IC Bursi. 
DEVI generare i contenuti per l'UDA intitolata "${titolo}" rispettando rigorosamente i vincoli forniti.

DATI TECNICI:
- Scuola: ${scuola} | Classe: ${classe}ª
- Materie: ${materie?.join(", ")}
- Ore: ${ore} | Periodo: ${periodo}
- Traguardi scelti: ${traguardiScelti?.join(" | ")}

VINCOLI DIDATTICI SPECIFICI (DA RISPETTARE RIGOROSAMENTE):
- METODOLOGIE DA USARE: ${metodologie || "Didattica attiva, laboratori e cooperative learning"}.
- PRODOTTO FINALE: ${prodotti || "Coerente con le note del docente"}.
- NOTE DOCENTE: ${descrizioneLibera || "Nessuna nota aggiuntiva"}.

REGOLE DI FORMATTAZIONE:
L'output deve essere diviso ESATTAMENTE dai seguenti tag tra parentesi quadre:

[CONTESTO]
Crea una "Situazione-Problema" stimolante. Se il docente ha indicato "${metodologie}", descrivi come queste metodologie aiuteranno a risolvere il problema.

[CONSEGNA]
Crea un compito di realtà operativo.

[TRAGUARDI]
Elenca i traguardi scelti dal docente: ${traguardiScelti?.join(" | ")}.

[PRODOTTO]
Descrivi dettagliatamente il prodotto: ${prodotti || "Basati sulle note: " + descrizioneLibera}.

[PIANO_LAVORO]
Genera la scansione per ${ore} ore. 
IMPORTANTE: Ogni fase deve usare il formato:
FASE: 1 | MATERIE: ... | DESCRIZIONE: ... | METODI: ${metodologie || "Lezioni attive"} | VALUTAZIONE: ... | ORE: ...

[VALUTAZIONE]
Specifica l'utilizzo delle griglie IC Bursi (Prerequisiti, Processo, Prodotto, Competenze).
`;
    } else {
      // 3. PROMPT PER LE 3 PROPOSTE (FASE 1)
      prompt = `Genera 3 proposte sintetiche per un'UDA scolastica (IC Bursi).
      Dati: Titolo "${titolo}", Classe ${classe}ª, Materie: ${materie?.join(", ")}.
      Note: ${descrizioneLibera || "Nessuna"}.
      Metodologie preferite: ${metodologie || "Non specificate"}.
      Prodotto finale richiesto: ${prodotti || "Non specificato"}.
      
      IMPORTANTE: Rispondi ESCLUSIVAMENTE con un oggetto JSON:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}
      Le proposte devono integrare le metodologie "${metodologie}" e portare al prodotto "${prodotti}" se specificati.`;
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
          { 
            role: "system", 
            content: `Sei il generatore ufficiale di UDA dell'IC F. Bursi. 
            Classe ${classe}ª ${scuola}. Usa un tono professionale e tecnico.` 
          },
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

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: data.choices[0].message.content });
    } else {
      const content = JSON.parse(data.choices[0].message.content);
      return NextResponse.json({ proposte: content.proposte });
    }

  } catch (error: any) {
    console.error("ERRORE API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
