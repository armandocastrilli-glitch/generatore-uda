"use client";
import { useState } from "react";

export default function GeneratoreUDA() {
  // --- STATO VECCHIO (Recuperato) ---
  const [titolo, setTitolo] = useState("");
  const [materie, setMaterie] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("");
  const [ore, setOre] = useState("");
  
  // --- STATO NUOVO ---
  const [scuola, setScuola] = useState("primaria");
  const [classe, setClasse] = useState("1");
  const [descrizioneLibera, setDescrizioneLibera] = useState("");
  const [loading, setLoading] = useState(false);
  const [proposte, setProposte] = useState<string[]>([]);

  const listaMaterie = [
    "Italiano", "Storia", "Geografia", "Matematica", "Scienze", 
    "Inglese", "Tecnologia", "Arte e Immagine", "Musica", "Ed. Fisica", "Religione"
  ];

  const toggleMateria = (m: string) => {
    setMaterie(prev => prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]);
  };

  const handleGeneraProposte = async () => {
    if (!titolo || materie.length === 0) {
      alert("Inserisci almeno il titolo e una materia!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titolo, scuola, classe, descrizioneLibera, materie, periodo, ore 
        }),
      });
      const data = await res.json();
      if (data.proposte) setProposte(data.proposte);
    } catch (err) {
      alert("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Generatore UDA - IC "F. Bursi"</h1>
        
        {/* SCELTA SCUOLA E CLASSE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ordine di Scuola</label>
            <select value={scuola} onChange={(e) => {setScuola(e.target.value); setClasse("1");}} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
              <option value="primaria">Scuola Primaria</option>
              <option value="secondaria">Secondaria I Grado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Classe</label>
            <select value={classe} onChange={(e) => setClasse(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
              {[...Array(scuola === "primaria" ? 5 : 3)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}ª</option>
              ))}
            </select>
          </div>
        </div>

        {/* DATI UDA (TITOLO, ORE, PERIODO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2">Periodo</label>
             <input type="text" value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="Es: Nov-Dic" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2">Ore previste</label>
             <input type="number" value={ore} onChange={(e) => setOre(e.target.value)} placeholder="Es: 20" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2">Titolo</label>
             <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Titolo UDA" className="w-full p-3 bg-slate-50 border rounded-xl outline-none" />
          </div>
        </div>

        {/* SELEZIONE MATERIE */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Materie coinvolte:</label>
          <div className="flex flex-wrap gap-2">
            {listaMaterie.map(m => (
              <button key={m} onClick={() => toggleMateria(m)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${materie.includes(m) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* DESCRIZIONE LIBERA */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Cosa vuoi realizzare? (Opzionale)</label>
          <textarea value={descrizioneLibera} onChange={(e) => setDescrizioneLibera(e.target.value)} placeholder="Descrivi laboratori, uscite o idee specifiche..." className="w-full p-3 bg-slate-50 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button onClick={handleGeneraProposte} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all">
          {loading ? "Generazione proposte..." : "Fase 1: Genera 3 Proposte Sintetiche"}
        </button>

        {/* RISULTATI */}
        {proposte.length > 0 && (
          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 italic">Scegli una proposta da sviluppare:</h2>
            {proposte.map((p, idx) => (
              <div key={idx} className="p-6 border-2 border-blue-50 rounded-2xl bg-white shadow-sm hover:border-blue-300 transition-all cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-blue-600 font-black tracking-widest text-xs uppercase">Opzione {idx + 1}</span>
                   <button className="bg-blue-50 text-blue-600 px-4 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors">SVILUPPA →</button>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
