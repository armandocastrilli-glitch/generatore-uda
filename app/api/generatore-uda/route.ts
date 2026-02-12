import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // LA TUA CHIAVE GROQ INSERITA DIRETTAMENTE
    const GROQ_API_KEY = "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"; 

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Sei un esperto di didattica italiana. Genera Unità di Apprendimento (UDA) professionali per la scuola media, formattate in Markdown, complete di competenze, fasi e griglia di valutazione."
          },
          {
            role: "user",
            content: `Genera un'UDA per l'IC "F. Bursi" di Fiorano Modenese. 
                      Titolo: ${titolo}
                      Classe: ${classe}
                      Materie: ${materie.join(", ")}
                      Periodo: ${periodo}
                      Ore: ${ore}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("ERRORE GROQ:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const udaProdotta = data.choices[0].message.content;

    return NextResponse.json({ uda: udaProdotta });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
