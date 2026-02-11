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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-blue-800 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Nuova Unità di Apprendimento</h1>
          <p className="text-blue-100 text-sm mt-1 italic">Modello IC "F. Bursi"</p>
        </div>

        <div className="p-8">
          {/* Sezione 1: Titolo e Info Base */}
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

          {/* Sezione 2: Materie */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-slate-700 mb-4">
              Discipline e Docenti Coinvolti <span className="text-blue-500 font-normal">(Seleziona tutte le materie interessate)</span>
            </label>
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

          {/* Sezione 3: Azione Finale */}
          <div className="pt-6 border-t border-slate-100">
            <button 
              disabled={!scelta.titolo || !scelta.classe || scelta.materie.length === 0}
              className={`w-full font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                !scelta.titolo || !scelta.classe || scelta.materie.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white hover:-translate-y-1"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Genera Bozze UDA con Intelligenza Artificiale
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 italic">
              L'AI genererà Obiettivi, Traguardi, Fasi e Griglia di Valutazione basandosi sul curricolo nazionale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}