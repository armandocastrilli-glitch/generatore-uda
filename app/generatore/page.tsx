"use client";
import { useState } from "react";

export default function GeneratoreUDA() {
  const [scelta, setScelta] = useState({
    titolo: "",
    classe: "",
    periodo: "1° Quadrimestre",
    ore: "20",
    materie: [] as string[]
  });

  // Nuovi stati per gestire l'AI
  const [loading, setLoading] = useState(false);
  const [udaGenerata, setUdaGenerata] = useState("");

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

  // FUNZIONE CHE ATTIVA IL TASTO VERDE
  const generaUDA = async () => {
    setLoading(true);
    setUdaGenerata(""); 
    
    try {
      // Nota: Qui usiamo il percorso esatto che vedo nel tuo screenshot
      const response = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scelta),
      });

      const data = await response.json();
      if (data.uda) {
        setUdaGenerata(data.uda);
      } else {
        alert("L'AI non ha risposto correttamente. Controlla la API Key su Vercel.");
      }
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore di connessione. Il server non risponde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
          
          <div className="bg-blue-800 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Nuova Unità di Apprendimento</h1>
            <p className="text-blue-100 text-sm mt-1 italic">Modello IC "F. Bursi"</p>
          </div>

          <div className="p-8">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Titolo dell'UDA</label>
                <input 
                  type="text"
                  placeholder="Es: Il Risorgimento, La sostenibilità, ecc..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setScelta({...scelta, titolo: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Classe</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setScelta({...scelta, classe: e.target.value})}
                  >
                    <option value="">Seleziona...</option>
                    <option value="1">Prima (1ª)</option>
                    <option value="2">Seconda (2ª)</option>
                    <option value="3">Terza (3ª)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Periodo Temporale</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setScelta({...scelta, periodo: e.target.value})}
                  >
                    <option value="1° Quadrimestre">1° Quadrimestre</option>
                    <option value="2° Quadrimestre">2° Quadrimestre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ore Totali Previste</label>
                  <input 
                    type="number"
                    value={scelta.ore}
                    className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setScelta({...scelta, ore: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-bold text-slate-700 mb-4">Discipline coinvolte</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {materieDisponibili.map(m => (
                  <button
                    key={m}
                    onClick={() => toggleMateria(m)}
                    className={`p-3 text-sm font-medium rounded-xl border transition-all ${
                      scelta.materie.includes(m) 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={generaUDA} // <--- ORA IL TASTO È COLLEGATO!
                disabled={loading || !scelta.titolo || !scelta.classe || scelta.materie.length === 0}
                className={`w-full font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                  loading || !scelta.titolo || !scelta.classe || scelta.materie.length === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "L'AI sta scrivendo..." : "Genera Bozze UDA con Intelligenza Artificiale"}
              </button>
            </div>
          </div>
        </div>

        {/* AREA DOVE APPARE IL TESTO GENERATO */}
        {udaGenerata && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-blue-800">UDA Generata</h2>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(udaGenerata);
                  alert("Copiato negli appunti!");
                }}
                className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100"
              >
                Copia Testo
              </button>
            </div>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif">
              {udaGenerata}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}