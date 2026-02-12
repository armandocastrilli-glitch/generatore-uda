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
    setProposte([]); // Pulisce le proposte precedenti
    try {
      const res = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titolo, 
          scuola, 
          classe, 
          descrizioneLibera 
        }),
      });
      
      const data = await res.json();

      if (data.proposte && Array.isArray(data.proposte)) {
        setProposte(data.proposte);
      } else {
        alert("Errore: il server non ha inviato il formato corretto.");
      }
    } catch (err) {
      console.error(err);
      alert("Errore di connessione durante la generazione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Nuova Progettazione UDA</h1>
        <p className="text-slate-500 mb-8">Definisci i parametri per ricevere 3 proposte creative per l'IC "F. Bursi".</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ordine di Scuola</label>
            <select 
              value={scuola}
              onChange={(e) => { setScuola(e.target.value); setClasse("1"); }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="primaria">Scuola Primaria</option>
              <option value="secondaria">Secondaria I Grado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Classe</label>
            <select 
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {[...Array(scuola === "primaria" ? 5 : 3)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}ª</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Argomento Principale</label>
            <input 
              type="text"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              placeholder="Es: Il ciclo dell'acqua, I Longobardi..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Descrizione Libera (Cosa hai in mente?)</label>
            <textarea 
              value={descrizioneLibera}
              onChange={(e) => setDescrizioneLibera(e.target.value)}
              placeholder="Descrivi l'idea, laboratori o obiettivi specifici..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button 
          onClick={handleGeneraProposte}
          disabled={loading || !titolo}
          className={`w-full mt-8 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 ${
            loading || !titolo ? "bg-slate-200 text-slate-400" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
          }`}
        >
          {loading ? "Elaborazione delle 3 proposte..." : "Genera 3 Proposte Sintetiche"}
        </button>

        {/* AREA RISULTATI */}
        {proposte.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-4">Scegli la base da sviluppare:</h2>
            {proposte.map((p, idx) => (
              <div key={idx} className="p-6 border border-slate-100 rounded-2xl bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-all shadow-sm group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Opzione {idx + 1}</span>
                  <button className="text-blue-600 text-sm font-bold group-hover:underline">Sviluppa questa UDA →</button>
                </div>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{p}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
