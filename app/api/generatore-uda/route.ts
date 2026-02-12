import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. ESTRAZIONE DATI POTENZIATA
    const { 
      titolo, scuola, classe, materie, periodo, ore, 
      propostaScelta, tipoRichiesta, descrizioneLibera,
      traguardiScelti, // <-- Fondamentale: i traguardi selezionati
      istruzioniSviluppo // <-- Fondamentale: i vincoli rigidi dal frontend
    } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key mancante" }, { status: 500 });
    }

    let prompt = "";

    if (tipoRichiesta === "UDA_COMPLETA") {
      // 2. PROMPT PER UDA COMPLETA CON VINCOLI ASSOLUTI
      prompt = `
        SVILUPPA UN'UDA COMPLETA SEGUENDO RIGIDAMENTE QUESTI PARAMETRI:

        DATI TECNICI:
        - Titolo: ${titolo}
        - Ordine: ${scuola}
        - Classe: ${classe}ª
        - Materie coinvolte: ${materie?.join(", ")}
        - Ore totali previste: ${ore} ore (L'UDA deve essere fattibile in questo tempo!)
        - Periodo: ${periodo}

        TRAGUARDI DEL CURRICOLO IC BURSI SELEZIONATI (VINCOLO ASSOLUTO):
        ${traguardiScelti?.join("\n") || "Nessun traguardo selezionato."}

        IDEA DI BASE DA SVILUPPARE:
        "${propostaScelta}"

        ${istruzioniSviluppo} 

        ISTRUZIONI DI FORMATTAZIONE:
        - Usa Markdown (Titoli #, ## e grassetti).
        - Tabella delle Fasi: Dividi le ${ore} ore in fasi realistiche.
        - Sezione Valutazione: Coerente con i traguardi indicati.
        - DIVIETO: Non aggiungere Competenze o Traguardi diversi da quelli forniti sopra.
      `;
    } else {
      // 3. PROMPT PER LE 3 PROPOSTE (FASE 1)
      prompt = `Genera 3 proposte sintetiche per un'UDA scolastica (IC Bursi).
      Dati: Titolo "${titolo}", Scuola ${scuola}, Classe ${classe}ª, Materie: ${materie?.join(", ")}.
      Ore disponibili: ${ore}.
      Note del docente: ${descrizioneLibera || "Nessuna"}.
      
      IMPORTANTE: Rispondi ESCLUSIVAMENTE con un oggetto JSON:
      {"proposte": ["Idea 1", "Idea 2", "Idea 3"]}
      Le proposte devono essere calibrate sulla classe ${classe}ª e sulla durata di ${ore} ore.`;
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
            Il tuo compito è compilare documenti tecnici basati ESCLUSIVAMENTE sul Curricolo d'Istituto fornito. 
            NON INVENTARE obiettivi. NON USARE frasi fatte pedagogiche. 
            Rispetta rigorosamente il numero di ore e l'età degli alunni (Classe ${classe}ª ${scuola}).` 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Abbassata la temperatura per renderlo più preciso e meno "creativo"
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
    console.error("ERRORE API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
