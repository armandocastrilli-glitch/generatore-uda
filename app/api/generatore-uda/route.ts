import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ESTRAZIONE DATI COMPLETA
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
      return NextResponse.json({ error: "API Key non configurata nelle Environment Variables" }, { status: 500 });
    }

    let prompt = "";

    if (tipoRichiesta === "UDA_COMPLETA") {
      // PROMPT DETTAGLIATO PER UDA COMPLETA (Protocollo IC Bursi)
      prompt = `
Agisci come un Esperto Progettista Didattico dell'IC F. Bursi. 
Genera l'UDA completa intitolata "${titolo}" per la scuola ${scuola}, classe ${classe}ª.

DATI TECNICI:
- MATERIE COINVOLTE: ${materie?.join(", ")}
- DURATA: ${ore} ore | PERIODO: ${periodo}
- TRAGUARDI DI COMPETENZA: ${traguardiScelti?.join(" | ")}
- METODOLOGIE DIDATTICHE: ${metodologie}
- PRODOTTO FINALE: ${prodotti}
- DESCRIZIONE/NOTE AGGIUNTIVE: ${descrizioneLibera}

REGOLE DI FORMATTAZIONE OBBLIGATORIE:
L'output deve essere strutturato ESCLUSIVAMENTE con i seguenti tag:

[CONTESTO]
(Descrivi il contesto scolastico e la motivazione del progetto)

[CONSEGNA]
(Descrivi la consegna agli studenti)

[TRAGUARDI]
(Elenca i traguardi e gli obiettivi formativi)

[PRODOTTO]
(Dettaglia il prodotto finale: ${prodotti})

[PIANO_LAVORO]
Per ogni fase del piano di lavoro, usa esattamente questo schema:
FASE: | MATERIE: | DESCRIZIONE: | METODI: | VALUTAZIONE: | ORE:

[VALUTAZIONE]
(Descrivi i criteri di valutazione e le griglie utilizzate)
`;
    } else {
      // PROMPT PER LE 3 PROPOSTE INIZIALI
      prompt = `
Sei l'assistente alla progettazione dell'IC Bursi. 
Genera 3 proposte sintetiche e creative di UDA basate su:
Titolo: "${titolo}"
Classe: ${classe}ª
Materie: ${materie?.join(", ")}
Metodologie: ${metodologie}
Prodotto: ${prodotti}

Rispondi ESCLUSIVAMENTE con un oggetto JSON in questo formato:
{"proposte": ["Titolo: ... | Idea: ...", "Titolo: ... | Idea: ...", "Titolo: ... | Idea: ..."]}
`;
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
            content: "Sei il generatore ufficiale di Unità di Apprendimento (UDA) dell'Istituto Comprensivo F. Bursi. Devi essere professionale, preciso e rispettare gli standard pedagogici della scuola italiana." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: tipoRichiesta === "UDA_COMPLETA" ? { type: "text" } : { type: "json_object" }
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("Nessuna risposta ricevuta dal modello IA.");
    }

    const content = data.choices[0].message.content;

    if (tipoRichiesta === "UDA_COMPLETA") {
      return NextResponse.json({ uda: content });
    } else {
      // Parsiamo il JSON delle 3 proposte
      const jsonContent = JSON.parse(content);
      return NextResponse.json({ proposte: jsonContent.proposte });
    }

  } catch (error: any) {
    console.error("ERRORE GENERAZIONE:", error);
    return NextResponse.json({ error: "Errore durante la generazione: " + error.message }, { status: 500 });
  }
}
