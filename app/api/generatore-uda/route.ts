import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // Recuperiamo la chiave in modo sicuro dalle variabili d'ambiente di Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("ERRORE: Chiave API non configurata su Vercel");
      return NextResponse.json({ error: "Configurazione server mancante" }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Sei un esperto di didattica italiana. Genera Unità di Apprendimento (UDA) professionali, formattate in Markdown, complete di competenze, fasi e griglia di valutazione."
          },
          {
            role: "user",
            content: `Genera un'UDA per l'IC "F. Bursi". 
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
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.choices[0].message.content;
    return NextResponse.json({ uda: text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
