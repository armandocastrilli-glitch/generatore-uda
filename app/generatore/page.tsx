"use client";
import { useState } from "react";

// --- ARCHIVIO INTEGRALE TRAGUARDI IC BURSI ---
const CURRICOLO_BURSI = {
  primaria: [
    {
      competenza: "1. Alfabetica Funzionale",
      traguardi: [
        { id: "TP1", testo: "Comunicare con chiarezza ed efficacia: esprimere oralmente idee, esperienze e domande in modo logico." },
        { id: "TP2a", testo: "Decodificare e comprendere messaggi chiave (comunicazione orale e non verbale)." },
        { id: "TP2b", testo: "Decodificare e comprendere messaggi chiave (comunicazione scritta)." },
        { id: "TP3", testo: "Interagire con media diversi: utilizzare immagini, video e strumenti digitali per esprimersi." },
        { id: "TP4", testo: "Leggere testi di vario genere della letteratura per l'infanzia e formulare giudizi personali." },
        { id: "TP5", testo: "Riassumere il contenuto di testi scritti individuando i punti principali." },
        { id: "TP6a", testo: "Produrre testi significativi (descrizioni, narrazioni, messaggi) rispettando la correttezza linguistica." },
        { id: "TP6b", testo: "Produrre testi significativi rispettando la struttura di base e la coerenza." }
      ]
    },
    {
      competenza: "2. Multilinguistica",
      traguardi: [
        { id: "TP7", testo: "Comprendere e utilizzare espressioni di uso quotidiano e frasi basilari." },
        { id: "TP8", testo: "Presentare sé stessi e gli altri fornendo informazioni personali di base." },
        { id: "TP9", testo: "Rispondere a domande semplici su dove si abita, gusti e possessi." },
        { id: "TP10", testo: "Descrivere persone, oggetti, luoghi familiari e attività quotidiane." },
        { id: "TP11", testo: "Scrivere brevi e semplici testi su argomenti familiari e situazioni quotidiane." }
      ]
    },
    {
      competenza: "3. Matematica, Scienze, Tecnologia, Geografia",
      traguardi: [
        { id: "TP12", testo: "Classificare oggetti e fenomeni in base a criteri definiti." },
        { id: "TP13", testo: "Produrre diverse soluzioni per un problema tecnico o matematico." },
        { id: "TP14", testo: "Utilizzare strumenti di misura e rappresentazione spaziale." },
        { id: "TP15", testo: "Riconoscere strutture e meccanismi elementari in macchine d'uso comune." },
        { id: "TP16", testo: "Formulare ipotesi semplici basate sull'osservazione scientifica." },
        { id: "TP17", testo: "Riconoscere le relazioni tra uomo e ambiente nelle scale geografiche." }
      ]
    },
    {
      competenza: "4. Digitale",
      traguardi: [
        { id: "TP18", testo: "Utilizzare le tecnologie digitali con consapevolezza per scopi comunicativi." },
        { id: "TP19", testo: "Cercare, raccogliere e conservare informazioni digitali." },
        { id: "TP20", testo: "Creare semplici contenuti digitali (testi, disegni, presentazioni)." },
        { id: "TP21", testo: "Riconoscere i rischi e i benefici dell'uso della rete." },
        { id: "TP22", testo: "Risolvere problemi tecnologici elementari." },
        { id: "TP23", testo: "Utilizzare il pensiero computazionale per risolvere piccoli quesiti." }
      ]
    },
    {
      competenza: "5. Personale, Sociale e Imparare a Imparare",
      traguardi: [
        { id: "TP24", testo: "Gestire il proprio tempo e le proprie attività scolastiche." },
        { id: "TP25", testo: "Riflettere sul proprio percorso di apprendimento (metacognizione)." },
        { id: "TP26", testo: "Collaborare costruttivamente in gruppo rispettando le regole." },
        { id: "TP27", testo: "Esprimere e gestire le proprie emozioni in contesti relazionali." },
        { id: "TP28", testo: "Dimostrare autonomia nello svolgimento dei compiti assegnati." },
        { id: "TP29", testo: "Adottare stili di vita sani e corretti." }
      ]
    },
    {
      competenza: "6. Cittadinanza (Ed. Civica)",
      traguardi: [
        { id: "TP30", testo: "Riconoscere i diritti e i doveri fondamentali del cittadino." },
        { id: "TP31", testo: "Conoscere e rispettare le regole della vita scolastica e sociale." },
        { id: "TP32", testo: "Valorizzare le diversità e promuovere l'inclusione." },
        { id: "TP33", testo: "Conoscere i simboli delle istituzioni (Stato, Regioni, Comuni)." },
        { id: "TP34", testo: "Agire in modo responsabile per la tutela dell'ambiente." },
        { id: "TP35", testo: "Esercitare la cittadinanza digitale in modo corretto e sicuro." },
        { id: "TP36", testo: "Partecipare attivamente a progetti di solidarietà e volontariato." }
      ]
    },
    {
      competenza: "7. Imprenditoriale",
      traguardi: [
        { id: "TP37", testo: "Mostrare curiosità e apertura verso nuove esperienze e attività." },
        { id: "TP38", testo: "Assumersi le proprie responsabilità, dimostrare impegno e laboriosità." },
        { id: "TP39", testo: "Affrontare gli insuccessi con resilienza e spirito critico." },
        { id: "TP40", testo: "Riconoscere e valorizzare i propri punti di forza e di debolezza." },
        { id: "TP41", testo: "Collaborare per trovare soluzioni innovative a problemi comuni." },
        { id: "TP42", testo: "Proporre semplici idee e iniziative nel contesto scolastico." }
      ]
    },
    {
      competenza: "8. Consapevolezza ed Espressione Culturale",
      traguardi: [
        { id: "TP43", testo: "Esplorare gli elementi delle diverse identità culturali e tradizioni." },
        { id: "TP44", testo: "Collocare nello spazio e nel tempo elementi culturali e opere d'arte." },
        { id: "TP45", testo: "Organizzare eventi personali e collettivi in sequenze temporali semplici." },
        { id: "TP46", testo: "Esprimersi attraverso diversi linguaggi (musicale, artistico, corporeo)." },
        { id: "TP47", testo: "Riconoscere il valore del patrimonio culturale del proprio territorio." },
        { id: "TP48", testo: "Partecipare a eventi culturali e manifestazioni artistiche." }
      ]
    }
  ],
  secondaria: [
    {
      competenza: "1. Alfabetica Funzionale",
      traguardi: [
        { id: "TS1", testo: "Comunicare in modo efficace e consapevole: produrre testi orali complessi e precisi." },
        { id: "TS2a", testo: "Interpretare il significato nel contesto: analizzare messaggi orali e visivi cogliendo sfumature." },
        { id: "TS2b", testo: "Interpretare il significato nel contesto: ricavare significati impliciti da messaggi scritti." },
        { id: "TS3", testo: "Padroneggiare strategie di lettura analitica e selettiva per testi complessi." },
        { id: "TS4", testo: "Elaborare informazioni provenienti da diverse fonti, inclusi materiali digitali." },
        { id: "TS5", testo: "Produrre testi scritti complessi e appropriati al contesto e allo scopo." },
        { id: "TS6", testo: "Pensare in modo flessibile: esaminare argomenti da più punti di vista." },
        { id: "TS7", testo: "Padroneggiare gli elementi fondamentali della frase semplice e complessa." }
      ]
    },
    {
      competenza: "2. Multilinguistica",
      traguardi: [
        { id: "TS8", testo: "Comprendere i punti principali di messaggi in lingua straniera su temi noti." },
        { id: "TS9", testo: "Interagire in lingua straniera in situazioni quotidiane e di studio." },
        { id: "TS10", testo: "Produrre testi semplici e coerenti su argomenti di interesse personale." },
        { id: "TS11", testo: "Utilizzare strategie di compensazione per comunicare con risorse limitate." },
        { id: "TS12", testo: "Riconoscere le differenze culturali tra la propria lingua e quella straniera." },
        { id: "TS13", testo: "Utilizzare strumenti digitali per l'apprendimento linguistico." }
      ]
    },
    {
      competenza: "3. Matematica, Scienze, Tecnologia, Geografia",
      traguardi: [
        { id: "TS19", testo: "Utilizzare linguaggi logico-matematici per modellizzare situazioni reali." },
        { id: "TS20", testo: "Analizzare dati e informazioni per trarre conclusioni motivate." },
        { id: "TS21", testo: "Utilizzare strumenti tecnologici per progettare e realizzare soluzioni." },
        { id: "TS22", testo: "Spiegare fenomeni naturali utilizzando leggi e modelli scientifici." },
        { id: "TS23", testo: "Rispettare le norme di sicurezza nell'uso di strumenti e laboratori." },
        { id: "TS24", testo: "Analizzare i processi di trasformazione dell'energia e il loro impatto." },
        { id: "TS25", testo: "Interpretare il paesaggio geografico come sistema antropico-naturale." }
      ]
    },
    {
      competenza: "4. Digitale",
      traguardi: [
        { id: "TS26", testo: "Gestire in modo autonomo e critico le informazioni digitali." },
        { id: "TS27", testo: "Utilizzare software di produttività per organizzare dati e contenuti." },
        { id: "TS28", testo: "Creare e modificare contenuti digitali multimediali complessi." },
        { id: "TS29", testo: "Riconoscere e prevenire rischi legati al cyberbullismo e alla privacy." },
        { id: "TS30", testo: "Programmare semplici algoritmi per risolvere problemi specifici." },
        { id: "TS31", testo: "Valutare l'affidabilità delle fonti di informazione online." },
        { id: "TS32", testo: "Sperimentare diverse forme di comunicazione mediata dalle tecnologie." },
        { id: "TS33", testo: "Configurare e personalizzare dispositivi digitali per le proprie esigenze." }
      ]
    },
    {
      competenza: "5. Personale, Sociale e Imparare a Imparare",
      traguardi: [
        { id: "TS34", testo: "Pianificare il proprio lavoro scolastico e gestire le scadenze." },
        { id: "TS35", testo: "Valutare criticamente le proprie prestazioni e i propri errori." },
        { id: "TS36", testo: "Collaborare attivamente in team multidisciplinari." },
        { id: "TS37", testo: "Dimostrare empatia e rispetto verso i compagni." },
        { id: "TS38", testo: "Gestire lo stress e le sfide con atteggiamento propositivo." },
        { id: "TS39", testo: "Essere consapevoli delle proprie inclinazioni per l'orientamento futuro." }
      ]
    },
    {
      competenza: "6. Cittadinanza (Ed. Civica)",
      traguardi: [
        { id: "TS40", testo: "Agire come cittadino responsabile nel rispetto della Costituzione." },
        { id: "TS41", testo: "Conoscere le istituzioni europee e internazionali." },
        { id: "TS42", testo: "Analizzare criticamente i fenomeni sociali e i problemi globali." },
        { id: "TS43", testo: "Sviluppare progetti per la legalità e la lotta alle mafie." },
        { id: "TS44", testo: "Rispettare i beni comuni e il patrimonio pubblico." },
        { id: "TS45", testo: "Promuovere lo sviluppo sostenibile e l'economia circolare." },
        { id: "TS46", testo: "Partecipare al dibattito democratico rispettando le opinioni altrui." },
        { id: "TS47", testo: "Applicare i principi della sicurezza stradale e del primo soccorso." },
        { id: "TS48", testo: "Riconoscere l'importanza del volontariato e dell'impegno civile." }
      ]
    },
    {
      competenza: "7. Imprenditoriale",
      traguardi: [
        { id: "TS49", testo: "Agire con autonomia e responsabilità per raggiungere obiettivi sfidanti." },
        { id: "TS50", testo: "Valutare il potenziale innovativo di nuove idee e progetti." },
        { id: "TS51", testo: "Adattarsi con flessibilità agli imprevisti e ai cambiamenti di contesto." },
        { id: "TS52", testo: "Riflettere sulle proprie esperienze per orientare le scelte future." },
        { id: "TS53", testo: "Collaborare e cooperare per trasformare idee in azioni concrete." }
      ]
    },
    {
      competenza: "8. Consapevolezza ed Espressione Culturale",
      traguardi: [
        { id: "TS54", testo: "Riconoscere e analizzare i principali stili e correnti artistiche e musicali." },
        { id: "TS55", testo: "Utilizzare diversi linguaggi espressivi per comunicare messaggi complessi." },
        { id: "TS56", testo: "Collocare opere e fenomeni culturali nel loro contesto storico e sociale." },
        { id: "TS57", testo: "Apprezzare la varietà delle espressioni culturali come patrimonio dell'umanità." },
        { id: "TS58", testo: "Partecipare attivamente a laboratori di teatro, musica o arte." },
        { id: "TS59", testo: "Analizzare criticamente messaggi pubblicitari e prodotti mediatici." }
      ]
    }
  ]
};

export default function GeneratoreUDA() {
  // --- STATI PER I DATI TECNICI ---
  const [titolo, setTitolo] = useState("");
  const [materie, setMaterie] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("");
  const [ore, setOre] = useState("");
  const [scuola, setScuola] = useState("primaria");
  const [classe, setClasse] = useState("1");
  const [descrizioneLibera, setDescrizioneLibera] = useState("");

  // --- STATO PER I TRAGUARDI SELEZIONATI ---
  const [selectedTraguardi, setSelectedTraguardi] = useState<string[]>([]);

  // --- STATI PER IL MOTORE AI ---
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

  const toggleTraguardo = (t: {id: string, testo: string}) => {
    const stringaTraguardo = `${t.id}: ${t.testo}`;
    setSelectedTraguardi(prev => 
      prev.includes(stringaTraguardo) ? prev.filter(item => item !== stringaTraguardo) : [...prev, stringaTraguardo]
    );
  };

  // 1. FUNZIONE PER GENERARE LE 3 IDEE INIZIALI
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

  // 2. FUNZIONE PER SVILUPPARE L'UDA COMPLETA
const sviluppaUdaCompleta = async (propostaScelta: string) => {
    if (selectedTraguardi.length === 0) {
      alert("Seleziona i traguardi: sono vincolanti per la generazione!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generatore-uda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titolo, 
          scuola, 
          classe, 
          materie, 
          periodo, 
          ore, 
          propostaScelta, 
          // ISTRUZIONE VINCOLANTE:
          istruzioniSviluppo: `
            PROGETTAZIONE RIGIDA SU TRAGUARDI SELEZIONATI:
            L'UDA deve essere costruita esclusivamente sui seguenti traguardi dell'IC Bursi: ${selectedTraguardi.join(", ")}.
            REGOLE OBBLIGATORIE:
            1. Ogni attività didattica deve essere finalizzata al raggiungimento di almeno uno dei traguardi scelti.
            2. Il 'Prodotto Finale' deve dimostrare l'acquisizione delle competenze legate a questi specifici traguardi.
            3. Nella tabella di valutazione, usa solo i criteri definiti nel Curricolo per questi codici.
            4. Non inserire obiettivi generici o non selezionati dal docente.
          `,
          traguardiScelti: selectedTraguardi, 
          tipoRichiesta: "UDA_COMPLETA" 
        }),
      });
      const data = await res.json();
      if (data.uda) setUdaFinale(data.uda);
    } catch (err) { 
      alert("Errore nello sviluppo dell'UDA."); 
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

        {/* DATI TECNICI */}
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

        {/* SEZIONE TRAGUARDI - DIVISA PER ORDINE DI SCUOLA */}
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase">
            Seleziona Traguardi dal Curricolo IC Bursi ({scuola.toUpperCase()}):
          </label>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
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
