
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
Agisci come un Esperto Progettista Didattico dell'IC Bursi, specializzato nella stesura di Unità di Apprendimento (UDA) secondo il modello d'Istituto 2025/26.

DEVI generare i contenuti per l'UDA intitolata "${titolo}" rispettando rigorosamente i vincoli forniti.

DATI TECNICI OBBLIGATORI:
- Ordine: Scuola Secondaria di I Grado
- Classe: ${classe}ª
- Materie coinvolte: ${materie?.join(", ")}
- Monte ore totale: ${ore} ore
- Note/Idee del docente da integrare: ${descrizioneLibera}
- Traguardi di competenza scelti (usa solo questi): ${traguardiScelti?.join(" | ")}

REGOLE DI FORMATTAZIONE (FONDAMENTALE):
L'output deve essere diviso ESATTAMENTE dai seguenti tag tra parentesi quadre. Non aggiungere introduzioni ("Ecco la tua uda...") o conclusioni.

[CONTESTO]
Analizza il titolo e le note del docente per creare una "Situazione-Problema" stimolante e realistica per ragazzi di ${classe}ª media. Spiega il "perché" si fa questa attività.

[CONSEGNA]
Scrivi cosa devono fare concretamente gli studenti. Definisci il compito di realtà in modo che sia chiaro e operativo.

[TRAGUARDI]
Elenca qui i traguardi forniti in precedenza, organizzandoli per punti elenco.

[PRODOTTO]
Descrivi il prodotto finale tangibile (es. un video, una presentazione, un manufatto, un evento) basandoti sulle note del docente: ${descrizioneLibera}.

[PIANO_LAVORO]
Genera la scansione temporale delle fasi per un totale di ${ore} ore. 
IMPORTANTE: Ogni fase deve occupare UNA SOLA RIGA e deve seguire pedissequamente questo formato per permettere l'estrazione nelle celle del Word:
FASE: 1 | MATERIE: (indica quali) | DESCRIZIONE: (cosa fanno) | METODI: (strumenti e metodologie) | VALUTAZIONE: (modalità di osservazione) | ORE: (numero ore)
FASE: 2 | MATERIE: ... | DESCRIZIONE: ... | METODI: ... | VALUTAZIONE: ... | ORE: ...
(Continua fino a coprire le ${ore} ore totali).

[VALUTAZIONE]
Specifica l'utilizzo delle griglie previste dal modello: griglia prerequisiti, griglia processo (soft skills), griglia prodotto e griglia competenze.
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
