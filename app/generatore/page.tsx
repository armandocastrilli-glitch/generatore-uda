"use client";
import { useState } from "react";

export default function GeneratoreUDA() {
  const [scelta, setScelta] = useState({
    classe: "",
    sezione: "",
    periodo: "Trimestre",
    materie: [] as string[]
  });

  const materieDisponibili = ["Italiano", "Storia", "Geografia", "Matematica", "Scienze", "Inglese", "Tecnologia", "Arte", "Musica", "Ed. Fisica", "Ed. Civica", "Francese", "Religione", "Sostegno"];

  const toggleMateria = (materia: string) => {
    setScelta(prev => ({
      ...prev,
      materie: prev.materie.includes(materia) 
        ? prev.materie.filter(m => m !== materia) 
        : [...prev.materie, materia]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-4">Configurazione UDA</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Scelta Classe */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Classe</label>
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

          {/* Scelta Periodo */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Periodo</label>
            <select 
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setScelta({...scelta, periodo: e.target.value})}
            >
              <option value="Trimestre">1° Trimestre</option>
              <option value="Pentamestre">Pentamestre</option>
            </select>
          </div>
        </div>

        {/* Scelta Materie */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Materie Coinvolte (seleziona più voci)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {materieDisponibili.map(m => (
              <button
                key={m}
                onClick={() => toggleMateria(m)}
                className={`p-2 text-sm rounded-lg border transition-all ${
                  scelta.materie.includes(m) 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all">
          Genera Bozza UDA con AI
        </button>
      </div>
    </div>
  );
}