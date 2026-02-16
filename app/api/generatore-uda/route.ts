import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. ESTRAZIONE DATI (Nomi puliti senza spazi)
    const { 
      titolo, 
      scuola, 
      classe, 
      materie, 
      periodo, 
      ore, 
      propostaScelta, 
      tipoRichiesta, 
      descrizioneLibera,
      metodologie, 
      prodotti, 
      traguardiScelti 
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
DEVI generare i contenuti per l'UDA intitolata "${titolo}" rispettando i seguenti vincoli.

DATI TECNICI:
- Ordine: ${scuola} | Classe: ${classe}ª
- Materie: ${materie?.join(", ")}
- Ore: ${ore} | Periodo: ${periodo}
- Traguardi scelti: ${traguardiScelti?.join(" | ")}

VINCOLI DIDATTICI:
- METODOLOGIE: ${metodologie || "Didattica attiva"}
- PRODOTTO FINALE: ${prodotti || "Coerente con le note"}
- NOTE DOCENTE: ${descrizioneLibera || "Nessuna"}

FORMATTAZIONE OBBLIGATORIA (Usa questi tag):

[CONTESTO]
Crea una Situazione-Problema stimolante legata a: ${descrizioneLibera}.

[CONSEGNA]
Definisci il compito di realtà operativo.

[TRAGUARDI]
Elenca i traguardi scelti: ${traguardiScelti?.join(" | ")}.

[PRODOTTO]
Descrivi il prodotto finale: ${prodotti || descrizioneLibera}.

[PIANO_LAVORO]
Genera la scansione per ${ore} ore. Ogni fase DEVE seguire questo formato:
FASE: 1 | MATERIE: ... | DESCRIZIONE: ... | METODI: ${metodologie || "Lezioni attive"} | VALUTAZIONE: ... | ORE: ...

[VALUTAZIONE]
Specifica l'utilizzo delle griglie d'Istituto (Prerequisiti, Processo, Prodotto, Competenze).
`;
    } 
    // 3. LOGICA 3 PROPOSTE
    else {
      prompt = `Genera 3 proposte sintetiche per un'UDA dell'IC Bursi.
      Titolo: "${titolo}", Classe: ${classe}ª, Materie: ${materie?.join(", ")}.
      Note: ${descrizioneLibera}. Metodologie: ${metodologie}. Prodotto: ${prodotti}.
      
      Rispondi SOLO con questo formato JSON:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}`;
    }

    // 4. CHIAMATA A GROQ
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
            content: `Sei il generatore ufficiale di UDA dell'IC F. Bursi. Classe ${classe}ª ${scuola}.` 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: tipoRichiesta === "UDA_COMPLETA" ? { type: "text" } : { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("L'IA non ha restituito risultati.");
    }

    const content = data.choices[0].message.content;

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: content });
    } else {
      // Parsing sicuro del JSON per le proposte
      try {
        const parsed = JSON.parse(content);
        return NextResponse.json({ proposte: parsed.proposte });
      } catch (e) {
        return NextResponse.json({ proposte: ["Errore nel formato della risposta IA"] });
      }
    }

  } catch (error: any) {
    console.error("ERRORE SERVER:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
