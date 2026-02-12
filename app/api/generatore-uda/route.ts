import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, scuola, classe, descrizioneLibera } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Chiave API non configurata su Vercel" }, { status: 500 });
    }

    const prompt = `Sei un esperto pedagogista dell'IC "F. Bursi". 
    Genera 3 proposte sintetiche diverse per un'UDA di scuola ${scuola}, classe ${classe}ª.
    Argomento: ${titolo}.
    Input docente: ${descrizioneLibera}.

    Per ogni proposta scrivi:
    1. Titolo creativo.
    2. Metodologia (es. flipped classroom, outdoor learning).
    3. Breve descrizione dell'attività.

    REGOLE DI RISPOSTA:
    - Rispondi SOLO con un oggetto JSON.
    - L'oggetto deve avere una chiave "proposte" che contiene un array di 3 stringhe.
    - Ogni stringa deve contenere il testo della proposta ben spaziato.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sei un assistente che genera esclusivamente output in formato JSON strutturato." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    // Parsiamo il contenuto JSON ricevuto dall'AI
    const content = JSON.parse(data.choices[0].message.content);
    
    return NextResponse.json({ 
      proposte: content.proposte || [] 
    });

  } catch (error: any) {
    console.error("ERRORE SERVER:", error.message);
    return NextResponse.json({ error: "Errore interno al server" }, { status: 500 });
  }
}
