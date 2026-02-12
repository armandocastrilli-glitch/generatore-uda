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
  const isCompilazioneDiretta = propostaScelta.includes("COMPILAZIONE_DIRETTA");

  prompt = `
    Sei un esperto pedagogista dell'IC Bursi. 
    DEVI COMPILARE LE SEZIONI DEL MODELLO UDA SECONDARIA SEGUENDO QUESTO SCHEMA FISSO.
    
    DATI DI INPUT:
    - Titolo: ${titolo}
    - Classe: ${classe}ª
    - Materie: ${materie?.join(", ")}
    - Ore: ${ore}
    - Note Docente: ${descrizioneLibera}
    - Traguardi Selezionati: ${traguardiScelti?.join(" | ")}

    REGOLE DI SCRITTURA:
    1. Usa i titoli delle sezioni esattamente come indicati sotto.
    2. Per ogni sezione, scrivi un contenuto coerente con l'età degli alunni (Classe ${classe}ª).
    3. Il "Piano di Lavoro" deve dividere le ${ore} ore totali in fasi realistiche.

    STRUTTURA DA SEGUIRE (FORMATTA COSÌ):

    ### SEZIONE 1: DATI IDENTIFICATIVI
    - Destinatari: Classe ${classe}ª
    - Ore complessive: ${ore}
    - Quadrimestre: ${periodo}
    - Materie: ${materie?.join(", ")}

    ### SEZIONE 2: PROGETTAZIONE
    - Titolo UDA: ${titolo}
    - Contestualizzazione situazione/problema: [Scrivi qui il contesto]
    - Consegna situazione/problema: [Scrivi qui cosa devono fare gli studenti]
    - Competenze chiave e Traguardi: ${traguardiScelti?.join("\n")}

    ### SEZIONE 3: VALUTAZIONE
    - Strumenti: Griglia prerequisiti, griglia processo (Soft Skills), griglia prodotto, griglia competenze.

    ### SEZIONE 4: PIANO DI LAVORO
    [Genera una lista di fasi: Fase 1, Fase 2, ecc. Per ogni fase indica: Materia, Descrizione attività, Metodologie, Valutazione, Ore]
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
