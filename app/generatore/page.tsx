"use client";
import { useState } from "react";

export default function GeneratoreUDA() {
  const [scelta, setScelta] = useState({
    titolo: "",
    classe: "1",
    periodo: "1° Quadrimestre",
    ore: "20",
    materie: [] as string[],
    scuola: "primaria", // Aggiunto per distinguere IC Bursi
    descrizioneLibera: "" // Aggiunto per il box di testo libero
  });

  const [loading, setLoading] = useState(false);
  const [proposte, setProposte] = useState<string[]>([]); // Per le 3 bozze
  const [udaFinale, setUdaFinale] = useState(""); // Per l'UDA completa sviluppata

  const materieDisponibili = [
    "Italiano", "Storia", "Geografia", "Matematica", "Scienze", 
    "Inglese", "Tecnologia", "Arte", "Musica", "Ed. Fisica", "Sostegno"
  ];

  const toggleMateria = (materia: string) => {
    setScelta(prev => ({
      ...prev,
      materie: prev.materie.includes(materia) 
        ? prev.materie.filter(m => m !== materia) 
        : [...prev.materie, materia]
    }));
  };

  // FASE 1: GENERA LE 3 PROPOSTE
  const generaProposte = async () => {
    setLoading(true);
    setProposte([]);
    setUdaFinale("");
    
    try {
      const response = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scelta, tipoRichiesta: "PROPOSTE" }),
      });

      const data = await response.json();
      if (data.proposte) {
        setProposte(data.proposte);
      } else {
        alert("Errore nella generazione delle proposte.");
      }
    } catch (error) {
      alert("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  // FASE 2: SVILUPPA LA PROPOSTA SCELTA
  const sviluppaUdaCompleta = async (propostaScelta: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scelta, propostaScelta, tipoRichiesta: "UDA_COMPLETA" }),
      });

      const data = await response.json();
      setUdaFinale(data.uda);
    } catch (error) {
      alert("Errore nello sviluppo dell'UDA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
          <div className="bg-blue-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold uppercase tracking-tight">Generatore UDA IC "F. Bursi"</h1>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ordine di Scuola</label>
                <select 
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setScelta({...scelta, scuola: e.target.value})}
                >
                  <option value="primaria">Scuola Primaria</option>
                  <option value="secondaria">Secondaria I Grado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Classe</label>
                <select 
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setScelta({...scelta, classe: e.target.value})}
                >
                  <option value="1">1ª</option>
                  <option value="2">2ª</option>
                  <option value="3">3ª</option>
                  {scelta.scuola === "primaria" && (
                    <>
                      <option value="4">4ª</option>
                      <option value="5">5ª</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <input 
              type="text"
              placeholder="Titolo dell'UDA (es: Il Ciclo dell'Acqua)"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setScelta({...scelta, titolo: e.target.value})}
            />

            <textarea 
              placeholder="Descrizione libera: scrivi qui le tue idee, laboratori o uscite previste..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setScelta({...scelta, descrizioneLibera: e.target.value})}
            />

            <div className="flex flex-wrap gap-2">
              {materieDisponibili.map(m => (
                <button
                  key={m}
                  onClick={() => toggleMateria(m)}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                    scelta.materie.includes(m) ? "bg-blue-600 text-white" : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button 
              onClick={generaProposte}
              disabled={loading || !scelta.titolo || scelta.materie.length === 0}
              className="w-full font-bold py-5 rounded-2xl shadow-xl bg-green-600 hover:bg-green-700 text-white transition-all disabled:bg-slate-300"
            >
              {loading ? "Elaborazione..." : "1. Genera 3 Idee per questa UDA"}
            </button>
          </div>
        </div>

        {/* VISUALIZZAZIONE 3 PROPOSTE */}
        {proposte.length > 0 && !udaFinale && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 ml-2">Scegli la proposta da sviluppare:</h2>
            {proposte.map((p, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-blue-600 flex justify-between items-center gap-4">
                <div className="text-slate-700 text-sm leading-relaxed flex-1">{p}</div>
                <button 
                  onClick={() => sviluppaUdaCompleta(p)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-blue-800 transition-all uppercase"
                >
                  Sviluppa →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* AREA UDA FINALE */}
        {udaFinale && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">UDA Completa Sviluppata</h2>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif mb-6">{udaFinale}</div>
            <button onClick={() => setUdaFinale("")} className="text-blue-600 font-bold underline text-sm">Indietro alle proposte</button>
          </div>
        )}
      </div>
    </div>
  );
}
