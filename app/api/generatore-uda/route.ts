import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { titolo, classe, periodo, ore, materie } = await req.json();
    
    // La tua chiave API inserita direttamente
    const apiKey = "AIzaSyDZzelj-ifA85l_C53YVXgHYiLHW3o8NjY"; 

    // Questa è la FETCH: una chiamata diretta all'indirizzo (URL) di Google
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Sei un esperto di didattica per la scuola secondaria italiana. 
                  Genera un'Unità di Apprendimento (UDA) completa per l'IC "F. Bursi".
                  Titolo: ${titolo}
                  Classe: ${classe}
                  Periodo: ${periodo}
                  Ore: ${ore}
                  Materie: ${materie.join(", ")}
                  Organizza il testo con titoli chiari: Competenze, Obiettivi, Fasi di lavoro (tabella) e Griglia di valutazione.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          }
        })
      }
    );

    // Trasformiamo la risposta di Google in dati leggibili
    const data = await response.json();

    // Gestione degli errori specifica per la fetch
    if (data.error) {
      console.error("Errore API Google:", data.error);
      return NextResponse.json(
        { error: "Google ha rifiutato la richiesta", dettaglio: data.error.message },
        { status: 500 }
      );
    }

    // Estraiamo il testo puro della risposta
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Nessuna risposta ricevuta dal modello.");
    }

    const udaProdotta = data.candidates[0].content.parts[0].text;

    // Inviamo l'UDA al tuo front-end
    return NextResponse.json({ uda: udaProdotta });

  } catch (error: any) {
    console.error("Errore Generale:", error.message);
    return NextResponse.json(
      { error: "Errore interno del server", dettaglio: error.message },
      { status: 500 }
    );
  }
}
