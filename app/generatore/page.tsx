"use client";
import { useState } from "react";

// --- ARCHIVIO INTEGRALE TRAGUARDI IC BURSI (Integrazione Nuova) ---
const CURRICOLO_BURSI = {
  primaria: [
    {
      competenza: "1. Alfabetica Funzionale",
      traguardi: [
        { id: "TP1", testo: "Comunicare con chiarezza ed efficacia: esprimere oralmente idee e domande." },
        { id: "TP2a", testo: "Decodificare e comprendere messaggi chiave (orale e non verbale)." },
        { id: "TP2b", testo: "Decodificare e comprendere messaggi chiave (scritto)." },
        { id: "TP5", testo: "Riassumere il contenuto di testi scritti individuando i punti principali." },
        { id: "TP6a", testo: "Produrre brevi testi con correttezza linguistica." }
      ]
    },
    {
      competenza: "3. Matematica, Scienze, Tecnologia",
      traguardi: [
        { id: "TP12", testo: "Classificare oggetti in base a criteri definiti." },
        { id: "TP13", testo: "Produrre diverse soluzioni per un problema." },
        { id: "TP16", testo: "Formulare ipotesi semplici basate sull'osservazione." }
      ]
    },
    {
      competenza: "6. Cittadinanza",
      traguardi: [
        { id: "TP30", testo: "Riconoscere i diritti e i doveri fondamentali del cittadino." },
        { id: "TP34", testo: "Agire in modo responsabile per la tutela dell'ambiente." }
      ]
    }
  ],
  secondaria: [
    {
      competenza: "1. Alfabetica Funzionale",
      traguardi: [
        { id: "TS1", testo: "Comunicare in modo efficace e consapevole organizzando il vocabolario." },
        { id: "TS2b", testo: "Interpretare il significato nel contesto scritto cogliendo sfumature." },
        { id: "TS5", testo: "Produrre testi scritti complessi e appropriati al contesto." }
      ]
    },
    {
      competenza: "4. Digitale",
      traguardi: [
        { id: "TS26", testo: "Gestire in modo autonomo e critico le informazioni digitali." },
        { id: "TS28", testo: "Creare e modificare contenuti digitali multimediali complessi." }
      ]
    }
  ]
};

export default function GeneratoreUDA() {
  // --- STATI PER I DATI TECNICI (Originali) ---
  const [titolo, setTitolo] = useState("");
  const [materie, setMaterie] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("");
  const [ore, setOre] = useState("");
  const [scuola, setScuola] = useState("primaria");
  const [classe, setClasse] = useState("1");
  const [descrizioneLibera, setDescrizioneLibera] = useState("");

  // --- NUOVO STATO PER I TRAGUARDI SELEZIONATI ---
  const [selectedTraguardi, setSelectedTraguardi] = useState<string[]>([]);

  // --- STATI PER IL MOTORE AI (Originali) ---
  const [loading, setLoading] = useState(false);
  const [proposte, setProposte] = useState<string[]>([]);
  const [udaFinale, setUdaFinale] = useState("");

  const listaMaterie = [
    "Italiano", "Storia", "Geografia", "Matematica", "Scienze", 
    "Inglese", "Tecnologia", "Arte e Immagine", "Musica", "Ed. Fisica", "Religione"
  ];

  const toggleMateria = (m: string) => {
    setMaterie(prev => prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]);
  };

  // --- NUOVA FUNZIONE PER GESTIRE I TRAGUARDI ---
  const toggleTraguardo = (t: {id: string, testo: string}) => {
    const stringaTraguardo = `${t.id}: ${t.testo}`;
    setSelectedTraguardi(prev => 
      prev.includes(stringaTraguardo) ? prev.filter(item => item !== stringaTraguardo) : [...prev, stringaTraguardo]
    );
  };

  // 1. FUNZIONE PER GENERARE LE 3 IDEE INIZIALI (Originale)
  const handleGeneraProposte = async () => {
    if (!titolo || materie.length === 0) {
      alert("Inserisci almeno il titolo e una materia!");
      return;
    }
    setLoading(true);
    setProposte([]);
    setUdaFinale("");
    try {
      const res = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titolo, scuola, classe, descrizioneLibera, materie, periodo, ore,
          tipoRichiesta: "PROPOSTE" 
        }),
      });
      const data = await res.json();
      if (data.proposte) setProposte(data.proposte);
    } catch (err) {
      alert("Errore di connessione al server.");
    } finally {
      setLoading(false);
    }
  };

  // 2. FUNZIONE PER SVILUPPARE L'UDA COMPLETA (Integrata con traguardiScelti)
  const sviluppaUdaCompleta = async (propostaScelta: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titolo, scuola, classe, materie, periodo, ore,
          propostaScelta, 
          traguardiScelti: selectedTraguardi, // <--- Integrazione nuova
          tipoRichiesta: "UDA_COMPLETA" 
        }),
      });
      const data = await res.json();
      if (data.uda) setUdaFinale(data.uda);
    } catch (err) {
      alert("Errore nello sviluppo dell'UDA completa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6 text-center uppercase tracking-tight">
          Progettazione UDA - IC "F. Bursi"
        </h1>
        
        {/* SELEZIONE SCUOLA E CLASSE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Ordine di Scuola</label>
            <select 
              value={scuola} 
              onChange={(e) => {setScuola(e.target.value); setClasse("1"); setSelectedTraguardi([]);}} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="primaria">Scuola Primaria</option>
              <option value="secondaria">Secondaria I Grado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Classe</label>
            <select 
              value={classe} 
              onChange={(e) => setClasse(e.target.value)} 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[...Array(scuola === "primaria" ? 5 : 3)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}ª</option>
              ))}
            </select>
          </div>
        </div>

        {/* DATI TECNICI (TITOLO, ORE, PERIODO) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Periodo</label>
             <input type="text" value={periodo} onChange={(e) => setPeriodo(e.target.value)} placeholder="Es: Gen-Mar" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Ore previste</label>
             <input type="number" value={ore} onChange={(e) => setOre(e.target.value)} placeholder="Es: 25" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Titolo UDA</label>
             <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} placeholder="Argomento principale" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>
        </div>

        {/* SELEZIONE MATERIE */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Discipline coinvolte:</label>
          <div className="flex flex-wrap gap-2">
            {listaMaterie.map(m => (
              <button 
                key={m} 
                onClick={() => toggleMateria(m)} 
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${materie.includes(m) ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* --- NUOVA SEZIONE: SELEZIONE TRAGUARDI DAL CURRICOLO (Integrazione) --- */}
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase">
            Seleziona Traguardi dal Curricolo (IC Bursi):
          </label>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {(scuola === "primaria" ? CURRICOLO_BURSI.primaria : CURRICOLO_BURSI.secondaria).map((comp, i) => (
              <div key={i}>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 border-b">{comp.competenza}</p>
                <div className="grid grid-cols-1 gap-2">
                  {comp.traguardi.map(t => (
                    <label key={t.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedTraguardi.includes(`${t.id}: ${t.testo}`) ? "bg-white border-blue-500 ring-1 ring-blue-500" : "bg-white/50 border-slate-100 hover:border-slate-300"}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedTraguardi.includes(`${t.id}: ${t.testo}`)}
                        onChange={() => toggleTraguardo(t)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-blue-600 mr-2">{t.id}</span>
                        <span className="text-slate-700">{t.testo}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {selectedTraguardi.length > 0 && (
            <p className="mt-2 text-[10px] font-bold text-blue-600 uppercase">Traguardi selezionati: {selectedTraguardi.length}</p>
          )}
        </div>

        {/* INPUT LIBERO */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Note o Idee particolari (Opzionale)</label>
          <textarea 
            value={descrizioneLibera} 
            onChange={(e) => setDescrizioneLibera(e.target.value)} 
            placeholder="Descrivi laboratori, uscite didattiche o prodotti finali che hai in mente..." 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <button 
          onClick={handleGeneraProposte} 
          disabled={loading || !titolo} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest"
        >
          {loading ? "Inviando richiesta..." : "Fase 1: Genera 3 Proposte"}
        </button>

        {/* BOX PROPOSTE GENERATE */}
        {proposte.length > 0 && !udaFinale && (
          <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 italic border-l-4 border-blue-600 pl-4 mb-6">
              Seleziona la bozza da sviluppare:
            </h2>
            {proposte.map((p, idx) => (
              <div key={idx} className="p-6 border border-slate-100 rounded-2xl bg-gradient-to-br from-blue-50 to-white flex justify-between items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-700 text-sm leading-relaxed flex-1">{p}</p>
                <button 
                  onClick={() => sviluppaUdaCompleta(p)} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-blue-800 transition-colors whitespace-nowrap"
                >
                  Sviluppa →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* AREA VISUALIZZAZIONE UDA COMPLETA */}
        {udaFinale && (
          <div className="mt-12 p-8 border-t-4 border-green-500 bg-slate-50 rounded-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase">UDA Sviluppata</h2>
              <button 
                onClick={() => setUdaFinale("")} 
                className="text-blue-600 font-bold text-sm underline"
              >
                Torna alle proposte
              </button>
            </div>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm bg-white p-6 rounded-xl border border-slate-200 shadow-inner">
              {udaFinale}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
