"use client";
import { useState } from "react";

export default function GeneratoreUDA() {
  const [scuola, setScuola] = useState("primaria");
  const [classe, setClasse] = useState("1");
  const [titolo, setTitolo] = useState("");
  const [descrizioneLibera, setDescrizioneLibera] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposte, setProposte] = useState<string[]>([]);

  const handleGeneraProposte = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generatore-uda", {
        method: "POST",
        body: JSON.stringify({ 
          titolo, 
          scuola, 
          classe, 
          descrizioneLibera,
          tipoRichiesta: "PROPOSTE_SINTETICHE" // Specifichiamo che vogliamo le 3 bozze
        }),
      });
      const data = await response.json();
      // Supponiamo che l'AI ci restituisca un array di 3 stringhe o un testo diviso
      setProposte(data.proposte); 
    } catch (err) {
      alert("Errore nella generazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Nuova Progettazione UDA</h1>
        <p className="text-slate-500 mb-8">Definisci i parametri per ricevere 3 proposte creative.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SELETTORE SCUOLA */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ordine di Scuola</label>
            <select 
              value={scuola}
              onChange={(e) => { setScuola(e.target.value); setClasse("1"); }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="primaria">Scuola Primaria</option>
              <option value="secondaria">Secondaria I Grado</option>
            </select>
          </div>

          {/* CLASSE DINAMICA */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Classe</label>
            <select 
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {[...Array(scuola === "primaria" ? 5 : 3)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}ª</option>
              ))}
            </select>
          </div>
        </div>

        {/* TITOLO E DESCRIZIONE */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Argomento / Titolo Predefinito</label>
            <input 
              type="text"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              placeholder="Es: Il ciclo dell'acqua, I Longobardi..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Cosa vuoi realizzare? (Descrizione Libera)</label>
            <textarea 
              value={descrizioneLibera}
              onChange={(e) => setDescrizioneLibera(e.target.value)}
              placeholder="Descrivi qui l'idea, eventuali uscite didattiche o laboratori specifici..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 outline-none"
            />
          </div>
        </div>

        <button 
          onClick={handleGeneraProposte}
          disabled={loading || !titolo}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
        >
          {loading ? "Elaborazione idee..." : "Genera 3 Proposte Sintetiche"}
        </button>

        {/* AREA RISULTATI (3 BOX) */}
        {proposte.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6">
            <h2 className="text-xl font-bold text-slate-800">Scegli la base da sviluppare:</h2>
            {proposte.map((p, idx) => (
              <div key={idx} className="p-6 border-2 border-slate-100 rounded-2xl bg-blue-50/50 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase">Proposta {idx + 1}</span>
                  <button className="text-blue-600 text-sm font-bold">Sviluppa questa →</button>
                </div>
                <div className="prose prose-slate max-w-none">{p}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
