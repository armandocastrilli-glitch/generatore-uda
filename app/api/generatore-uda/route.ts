import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, scuola, classe, descrizioneLibera } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Chiave API non configurata" }, { status: 500 });
    }

    // Qui costruiamo il prompt specifico per le 3 proposte
    const prompt = `Sei un esperto pedagogista per l'IC "F. Bursi" di Fiorano Modenese. 
    Il docente insegna alla scuola ${scuola} ed è in una classe ${classe}ª.
    Argomento: ${titolo}.
    Note del docente: ${descrizioneLibera}.

    GENERA 3 PROPOSTE SINTETICHE diverse per un'UDA. 
    Ogni proposta deve essere breve e includere:
    1. Un titolo accattivante.
    2. L'approccio metodologico (es. Tinkering, Debate, Outdoor Education).
    3. Una sintesi dell'attività principale.

    IMPORTANTE: Rispondi ESCLUSIVAMENTE con un array JSON di stringhe, senza testo prima o dopo.
    Esempio formato: ["Proposta 1...", "Proposta 2...", "Proposta 3..."]`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sei un assistente che parla solo tramite array JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        // Chiediamo a Groq di forzare il formato JSON
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    // Groq con response_format restituisce un oggetto, dobbiamo estrarre le proposte
    const content = JSON.parse(data.choices[0].message.content);
    
    // Gestiamo sia se l'AI restituisce { "proposte": [...] } sia se restituisce l'array diretto
    const elencoProposte = Array.isArray(content) ? content : content.proposte;

    return NextResponse.json({ proposte: elencoProposte });

  } catch (error: any) {
    console.error("Errore API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
