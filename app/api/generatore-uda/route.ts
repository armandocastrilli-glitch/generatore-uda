import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // INCOLLA QUI LA TUA CHIAVE GROQ
    const GROQ_API_KEY = "IL_TUO_CODICE_GSK_QUI"; 

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Llama 3.3 70B è un modello incredibile per la didattica
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
      console.error("ERRORE GROQ:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // Estraiamo il testo della risposta
    const udaProdotta = data.choices[0].message.content;

    return NextResponse.json({ uda: udaProdotta });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
