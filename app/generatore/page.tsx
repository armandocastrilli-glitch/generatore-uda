"use client";

import React, { useState } from 'react';

// --- 1. ARCHIVIO INTEGRALE TRAGUARDI IC BURSI ---
const CURRICOLO_BURSI = {
  primaria: [
    { competenza: "1. Alfabetica Funzionale", traguardi: [
      { id: "TP1", testo: "Comunicare con chiarezza ed efficacia: esprimere oralmente idee, esperienze e domande in modo logico." },
      { id: "TP2a", testo: "Decodificare e comprendere messaggi chiave (comunicazione orale e non verbale)." },
      { id: "TP2b", testo: "Decodificare e comprendere messaggi chiave (comunicazione scritta)." },
      { id: "TP3", testo: "Interagire con media diversi: utilizzare immagini, video e strumenti digitali per esprimersi." },
      { id: "TP4", testo: "Leggere testi di vario genere della letteratura per l'infanzia e formulare giudizi personali." },
      { id: "TP5", testo: "Riassumere il contenuto di testi scritti individuando i punti principali." },
      { id: "TP6a", testo: "Produrre testi significativi (descrizioni, narrazioni, messaggi) rispettando la correttezza linguistica." },
      { id: "TP6b", testo: "Produrre testi significativi rispettando la struttura di base e la coerenza." }
    ]},
    { competenza: "2. Multilinguistica", traguardi: [
      { id: "TP7", testo: "Comprendere e utilizzare espressioni di uso quotidiano e frasi basilari." },
      { id: "TP8", testo: "Presentare sé stessi e gli altri fornendo informazioni personali di base." },
      { id: "TP9", testo: "Rispondere a domande semplici su dove si abita, gusti e possessi." },
      { id: "TP10", testo: "Descrivere persone, oggetti, luoghi familiari e attività quotidiane." },
      { id: "TP11", testo: "Scrivere brevi e semplici testi su argomenti familiari e situazioni quotidiane." }
    ]},
    { competenza: "3. Matematica, Scienze, Tecnologia, Geografia", traguardi: [
      { id: "TP12", testo: "Classificare oggetti e fenomeni in base a criteri definiti." },
      { id: "TP13", testo: "Produrre diverse soluzioni per un problema tecnico o matematico." },
      { id: "TP14", testo: "Utilizzare strumenti di misura e rappresentazione spaziale." },
      { id: "TP15", testo: "Riconoscere strutture e meccanismi elementari in macchine d'uso comune." },
      { id: "TP16", testo: "Formulare ipotesi semplici basate sull'osservazione scientifica." },
      { id: "TP17", testo: "Riconoscere le relazioni tra uomo e ambiente nelle scale geografiche." }
    ]},
    { competenza: "4. Digitale", traguardi: [
      { id: "TP18", testo: "Utilizzare le tecnologie digitali con consapevolezza per scopi comunicativi." },
      { id: "TP19", testo: "Cercare, raccogliere e conservare informazioni digitali." },
      { id: "TP20", testo: "Creare semplici contenuti digitali (testi, disegni, presentazioni)." },
      { id: "TP21", testo: "Riconoscere i rischi e i benefici dell'uso della rete." },
      { id: "TP22", testo: "Risolvere problemi tecnologici elementari." },
      { id: "TP23", testo: "Utilizzare il pensiero computazionale per risolvere piccoli quesiti." }
    ]},
    { competenza: "5. Personale, Sociale e Imparare a Imparare", traguardi: [
      { id: "TP24", testo: "Gestire il proprio tempo e le proprie attività scolastiche." },
      { id: "TP25", testo: "Riflettere sul proprio percorso di apprendimento (metacognizione)." },
      { id: "TP26", testo: "Collaborare costruttivamente in gruppo rispettando le regole." },
      { id: "TP27", testo: "Esprimere e gestire le proprie emozioni in contesti relazionali." },
      { id: "TP28", testo: "Dimostrare autonomia nello svolgimento dei compiti assegnati." },
      { id: "TP29", testo: "Adottare stili di vita sani e corretti." }
    ]},
    { competenza: "6. Cittadinanza (Ed. Civica)", traguardi: [
      { id: "TP30", testo: "Riconoscere i diritti e i doveri fondamentali del cittadino." },
      { id: "TP31", testo: "Conoscere e rispettare le regole della vita scolastica e sociale." },
      { id: "TP32", testo: "Valorizzare le diversità e promuovere l'inclusione." },
      { id: "TP33", testo: "Conoscere i simboli delle istituzioni (Stato, Regioni, Comuni)." },
      { id: "TP34", testo: "Agire in modo responsabile per la tutela dell'ambiente." },
      { id: "TP35", testo: "Esercitare la cittadinanza digitale in modo corretto e sicuro." },
      { id: "TP36", testo: "Partecipare attivamente a progetti di solidarietà e volontariato." }
    ]},
    { competenza: "7. Imprenditoriale", traguardi: [
      { id: "TP37", testo: "Mostrare curiosità e apertura verso nuove esperienze e attività." },
      { id: "TP38", testo: "Assumersi le proprie responsabilità, dimostrare impegno e laboriosità." },
      { id: "TP39", testo: "Affrontare gli insuccessi con resilienza e spirito critico." },
      { id: "TP40", testo: "Riconoscere e valorizzare i propri punti di forza e di debolezza." },
      { id: "TP41", testo: "Collaborare per trovare soluzioni innovative a problemi comuni." },
      { id: "TP42", testo: "Proporre semplici idee e iniziative nel contesto scolastico." }
    ]},
    { competenza: "8. Consapevolezza ed Espressione Culturale", traguardi: [
      { id: "TP43", testo: "Esplorare gli elementi delle diverse identità culturali e tradizioni." },
      { id: "TP44", testo: "Collocare nello spazio e nel tempo elementi culturali e opere d'arte." },
      { id: "TP45", testo: "Organizzare eventi personali e collettivi in sequenze temporali semplici." },
      { id: "TP46", testo: "Esprimersi attraverso diversi linguaggi (musicale, artistico, corporeo)." },
      { id: "TP47", testo: "Riconoscere il valore del patrimonio culturale del proprio territorio." },
      { id: "TP48", testo: "Partecipare a eventi culturali e manifestazioni artistiche." }
    ]}
  ],
  secondaria: [
    { competenza: "1. Alfabetica Funzionale", traguardi: [
      { id: "TS1", testo: "lo studente comprende ed usa le informazioni ricavate da documenti di vario tipo" },
      { id: "TS2a", testo: "Lo studente comunica in forma orale" },
      { id: "TS2b", testo: "Interpretare il significato nel contesto: ricavare significati impliciti da messaggi scritti." },
      { id: "TS3", testo: "Padroneggiare strategie di lettura analitica e selettiva per testi complessi." },
      { id: "TS4", testo: "Elaborare informazioni provenienti da diverse fonti, inclusi materiali digitali." },
      { id: "TS5", testo: "lo studente comunica in forma scritta" },
      { id: "TS6", testo: "Pensare in modo flessibile: esaminare argomenti da più punti di vista." },
      { id: "TS7", testo: "Padroneggiare gli elementi fondamentali della frase semplice e complessa." }
    ]},
    { competenza: "2. Multilinguistica", traguardi: [
      { id: "TS8", testo: "lo studente comprende ed usa le informazioni ricavate da documenti di vario tipo" },
      { id: "TS9", testo: "Lo studente comunica in forma orale" },
      { id: "TS10", testo: "lo studente comunica in forma scritta" },
      { id: "TS11", testo: "Utilizzare strategie di compensazione per comunicare con risorse limitate." },
      { id: "TS12", testo: "Riconoscere le differenze culturali tra la propria lingua e quella straniera." },
      { id: "TS13", testo: "Utilizzare strumenti digitali per l'apprendimento linguistico." }
    ]},
    { competenza: "3. Matematica e Scienze", traguardi: [
      { id: "TS19", testo: "lo studente comprende ed usa le informazioni ricavate da documenti di vario tipo" },
      { id: "TS20", testo: "Utilizza il proprio patrimonio di conoscenze per comprendere i problemi e proporre soluzioni" },
      { id: "TS21", testo: "Utilizzare strumenti tecnologici per progettare e realizzare soluzioni." },
      { id: "TS22", testo: "Spiegare fenomeni naturali utilizzando leggi e modelli scientifici." },
      { id: "TS23", testo: "Rispettare le norme di sicurezza nell'uso di strumenti e laboratori." },
      { id: "TS24", testo: "Analizzare i processi di trasformazione dell'energia e il loro impatto." },
      { id: "TS25", testo: "Interpretare il paesaggio geografico come sistema antropico-naturale." }
    ]},
    { competenza: "4. Digitale", traguardi: [
      { id: "TS26", testo: "Gestire in modo autonomo e critico le informazioni digitali." },
      { id: "TS27", testo: "Utilizzare software di produttività per organizzare dati e contenuti." },
      { id: "TS28", testo: "Creare e modificare contenuti digitali multimediali complessi." },
      { id: "TS29", testo: "Riconoscere e prevenire rischi legati al cyberbullismo e alla privacy." },
      { id: "TS30", testo: "Programmare semplici algoritmi per risolvere problemi specifici." },
      { id: "TS31", testo: "Valutare l'affidabilità delle fonti di informazione online." },
      { id: "TS32", testo: "Sperimentare diverse forme di comunicazione mediata dalle tecnologie." },
      { id: "TS33", testo: "Configurare e personalizzare dispositivi digitali per le proprie esigenze." }
    ]},
    { competenza: "5. Imparare a imparare", traguardi: [
      { id: "TS34", testo: "Uso delle conoscenze apprese per organizzare e realizzare un prodotto" },
      { id: "TS35", testo: "Verifica il processo e i risultati raggiunti" },
      { id: "TS36", testo: "Collaborare attivamente in team multidisciplinari." },
      { id: "TS37", testo: "Dimostrare empatia e rispetto verso i compagni." },
      { id: "TS38", testo: "Gestire lo stress e le sfide con atteggiamento propositivo." },
      { id: "TS39", testo: "Essere consapevoli delle proprie inclinazioni per l'orientamento futuro." }
    ]},
    { competenza: "6. Cittadinanza", traguardi: [
      { id: "TS40", testo: "Agire come cittadino responsabile nel rispetto della Costituzione." },
      { id: "TS41", testo: "Conoscere le istituzioni europee e internazionali." },
      { id: "TS42", testo: "Analizzare criticamente i fenomeni sociali e i problemi globali." },
      { id: "TS43", testo: "Sviluppare progetti per la legalità e la lotta alle mafie." },
      { id: "TS44", testo: "Rispettare i beni comuni e il patrimonio pubblico." },
      { id: "TS45", testo: "Promuovere lo sviluppo sostenibile e l'economia circolare." },
      { id: "TS46", testo: "Partecipare al dibattito democratico rispettando le opinioni altrui." },
      { id: "TS47", testo: "Applicare i principi della sicurezza stradale e del primo soccorso." },
      { id: "TS48", testo: "Riconoscere l'importanza del volontariato e dell'impegno civile." }
    ]},
    { competenza: "7. Imprenditorialità", traguardi: [
      { id: "TS49", testo: "Uso delle conoscenze apprese per organizzare e realizzare un prodotto" },
      { id: "TS50", testo: "Verifica il processo e i risultati raggiunti" },
      { id: "TS51", testo: "Utilizzare conoscenze e nozioni di base in modo organico per ricercare e organizzare nuove informazioni" },
      { id: "TS52", testo: "Riflettere sulle proprie esperienze per orientare le scelte future." },
      { id: "TS53", testo: "Collaborare e cooperare per trasformare idee in azioni concrete." }
    ]},
    { competenza: "8. Espressione Culturale", traguardi: [
      { id: "TS54", testo: "Riconoscere e analizzare i principali stili e correnti artistiche e musicali." },
      { id: "TS55", testo: "Utilizzare diversi linguaggi espressivi per comunicare messaggi complessi." },
      { id: "TS56", testo: "Collocare opere e fenomeni culturali nel loro contesto storico e sociale." },
      { id: "TS57", testo: "Apprezzare la varietà delle espressioni culturali come patrimonio dell'umanità." },
      { id: "TS58", testo: "Partecipare attivamente a laboratori di teatro, musica o arte." },
      { id: "TS59", testo: "Analizzare criticamente messaggi pubblicitari e prodotti mediatici." }
    ]}
  ]
};

"use client";

import React, { useState } from 'react';

// --- DATABASE GRIGLIE (Basato sui tuoi dati CSV) ---
const DATABASE_GRIGLIE: Record<string, any> = {
  "TS1": { iniziale: "solo se guidato", base: "in modo autonomo ma elementare", intermedio: "in modo adeguato", avanzato: "con piena consapevolezza" },
  "TS2a": { iniziale: "in modo approssimativo", base: "in modo elementare", intermedio: "in modo adeguato", avanzato: "in modo ricco ed efficace" },
  "TS5": { iniziale: "in modo approssimativo", base: "in modo elementare", intermedio: "in modo adeguato", avanzato: "in modo ricco ed efficace" },
  "TS8": { iniziale: "solo se guidato", base: "in modo autonomo ma elementare", intermedio: "in modo adeguato", avanzato: "con piena consapevolezza" },
  "TS34": { iniziale: "in modo passivo", base: "con compiti solo da esecutore", intermedio: "agisce in modo propositivo e prende decisioni", avanzato: "si assume responsabilità e facilita il lavoro dei compagni" },
  "TS49": { iniziale: "solo se guidato", base: "con compiti solo da esecutore", intermedio: "agisce in modo propositivo e prende decisioni", avanzato: "si assume responsabilità e facilita il lavoro dei compagni" },
  "TS35": { iniziale: "in modo poco consapevole e solo se guidato", base: "in modo poco consapevole", intermedio: "in modo consapevole e autonomo", avanzato: "evidenzia spirito critico nel processo di autovalutazione" },
  "TS50": { iniziale: "in modo poco consapevole e solo se guidato", base: "in modo poco consapevole", intermedio: "in modo consapevole e autonomo", avanzato: "evidenzia spirito critico nel processo di autovalutazione" }
};

export default function GeneratoreUDA() {
  const [titolo, setTitolo] = useState("");
  const [materie, setMaterie] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("Primo Quadr.");
  const [ore, setOre] = useState("10");
  const [scuola, setScuola] = useState("secondaria");
  const [classe, setClasse] = useState("1");
  const [descrizioneLibera, setDescrizioneLibera] = useState("");
  const [selectedTraguardi, setSelectedTraguardi] = useState<string[]>([]);
  const [udaFinale, setUdaFinale] = useState("");
  const [loading, setLoading] = useState(false);

  const listaMaterie = ["Italiano", "Storia", "Geografia", "Matematica", "Scienze", "Inglese", "Tecnologia", "Arte", "Musica", "Ed. Fisica", "Ed. Civica"];

  // Funzione per estrarre i blocchi di testo [TAG] generati dall'AI
  const estrai = (testo: string, tag: string) => {
    const regex = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\s*\\[|$)`);
    const match = testo.match(regex);
    return match ? match[1].trim() : "---";
  };

  const scaricaWordCompilato = () => {
    if (!udaFinale) return;

    // 1. Righe Piano di Lavoro (Tabella Fasi)
    const pianoTesto = estrai(udaFinale, "PIANO_LAVORO");
    const righePiano = pianoTesto.split("\n").filter(r => r.includes("|")).map(r => {
      const c = r.split("|").map(cell => cell.trim());
      return `<tr><td>${c[0]||""}</td><td>${c[1]||""}</td><td>${c[2]||""}</td><td>${c[3]||""}</td><td>${c[4]||""}</td><td>${c[5]||""}</td></tr>`;
    }).join("");

    // 2. Righe Griglia Competenze (Mappatura Traguardi -> Livelli)
    const righeGriglia = selectedTraguardi.map(t => {
      const id = t.split(":")[0].trim();
      const livelli = DATABASE_GRIGLIE[id] || { iniziale: "Solo se guidato", base: "In autonomia", intermedio: "Adeguato", avanzato: "Piena padronanza" };
      return `
        <tr>
          <td style="font-weight:bold">${t}</td>
          <td>${livelli.iniziale}</td>
          <td>${livelli.base}</td>
          <td>${livelli.intermedio}</td>
          <td>${livelli.avanzato}</td>
        </tr>`;
    }).join("");

    const blobContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><style>
        table { border-collapse: collapse; width: 100%; font-family: Calibri; margin-bottom: 20px; }
        td, th { border: 1px solid black; padding: 8px; font-size: 10pt; }
        .header { background-color: #D9D9D9; text-align: center; font-weight: bold; font-size: 14pt; padding: 10px; }
      </style></head>
      <body>
        <div class="header">MODELLO UDA - IC BURSI</div>
        <table>
          <tr><td><b>Titolo:</b> ${titolo}</td><td><b>Classe:</b> ${classe}ª ${scuola}</td></tr>
          <tr><td><b>Materie:</b> ${materie.join(", ")}</td><td><b>Ore:</b> ${ore}</td></tr>
        </table>
        <h3>PIANO DI LAVORO</h3>
        <table>
          <tr style="background:#EEE"><th>Fase</th><th>Materie</th><th>Descrizione</th><th>Metodi</th><th>Valutazione</th><th>Ore</th></tr>
          ${righePiano}
        </table>
        <br clear=all style='page-break-before:always'>
        <div class="header">GRIGLIA DI VALUTAZIONE</div>
        <table>
          <tr style="background:#EEE"><th>Traguardo</th><th>Iniziale</th><th>Base</th><th>Intermedio</th><th>Avanzato</th></tr>
          ${righeGriglia}
        </table>
      </body></html>`;

    const blob = new Blob(['\ufeff', blobContent], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `UDA_${titolo}.doc`;
    link.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2">Generatore UDA Integrale</h1>
      
      {/* Input Sezione */}
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Titolo UDA" className="border p-2" onChange={e => setTitolo(e.target.value)} />
        <input type="number" placeholder="Ore" className="border p-2" onChange={e => setOre(e.target.value)} />
      </div>

      {/* Selezione Materie */}
      <div className="flex flex-wrap gap-2">
        {listaMaterie.map(m => (
          <button 
            key={m} 
            onClick={() => setMaterie(prev => prev.includes(m) ? prev.filter(x => x!==m) : [...prev, m])}
            className={`px-3 py-1 rounded text-sm ${materie.includes(m) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <textarea 
        placeholder="Note aggiuntive per l'AI..." 
        className="w-full border p-2 h-24"
        onChange={e => setDescrizioneLibera(e.target.value)}
      />

      <div className="flex gap-4">
        <button 
          onClick={() => setUdaFinale("[PIANO_LAVORO]\n1 | Italiano | Lettura | Frontale | Osservazione | 2\n[CONTESTO]\nEsempio contesto...")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Simula Generazione
        </button>
        
        <button 
          onClick={scaricaWordCompilato}
          disabled={!udaFinale}
          className="bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          Scarica Word Progettazione
        </button>
      </div>
    </div>
  );
}
    const livelli = getGrigliaLivelli(id);

    return `
      <tr>
        <td style="border:1px solid black; padding:5px; font-size:9pt;">${compNome}</td>
        <td style="border:1px solid black; padding:5px; font-weight:bold;">${tragTesto}</td>
        <td style="border:1px solid black; padding:5px;">${livelli.iniziale}</td>
        <td style="border:1px solid black; padding:5px;">${livelli.base}</td>
        <td style="border:1px solid black; padding:5px;">${livelli.intermedio}</td>
        <td style="border:1px solid black; padding:5px;">${livelli.avanzato}</td>
      </tr>`;
  }).join("");

  // ... (Resto della logica HTML per il Blob del Word come nei messaggi precedenti)
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
      alert("Seleziona i traguardi dal curricolo! Sono vincoli assoluti.");
      return;
    }
    setLoading(true);
    
    // Capisce se stiamo compilando direttamente o sviluppando una proposta dell'AI
    const isCompilazioneDiretta = propostaScelta.includes("COMPILAZIONE_DIRETTA");

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
          traguardiScelti: selectedTraguardi, 
          tipoRichiesta: "UDA_COMPLETA",
          // PROTOCOLLO DI TARATURA RIGIDA (Unificato e Potenziato)
          istruzioniSviluppo: `
            PROTOCOLLO DI GENERAZIONE VINCOLATA - IC BURSI
            ${isCompilazioneDiretta 
              ? "AGISCI COME COMPILATORE TECNICO: Trasforma le note del docente in un'UDA formattata senza aggiungere creatività esterna." 
              : `SVILUPPA L'IDEA SCELTA: "${propostaScelta}"`
            }

            PARAMETRI REALI DA RISPETTARE (NON DEROGABILI):
            1. CLASSE E ORDINE: Classe ${classe}ª, Scuola ${scuola}. Linguaggio e attività devono essere tarati esattamente su questa età.
            2. TEMPI: Massimo ${ore} ore totali. La sequenza didattica deve essere realistica per questo monte ore.
            3. MATERIE: ${materie.join(", ")}.
            4. TRAGUARDI (ASSOLUTO): Usa SOLO ${selectedTraguardi.join(" | ")}. Divieto di inventare competenze chiave o obiettivi extra.
            5. NOTE DOCENTE: Integra fedelmente queste indicazioni: ${descrizioneLibera}.
            6. FORMATO: Output diretto, professionale, in Markdown, senza introduzioni discorsive.
          `,
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
// --- FUNZIONE PASSO 3: DOWNLOAD MODELLO WORD INTEGRALE ---
const scaricaWordCompilato = () => {
  if (!udaFinale) {
    alert("Genera prima l'UDA!");
    return;
  }

  // 1. Funzione interna per trovare Competenza e Testo partendo dall'ID (es. TS1)
  const trovaDatiCurricolo = (idTraguardo) => {
    // Uniamo i due array per la ricerca universale
    const sezioni = [...CURRICOLO_BURSI.primaria, ...CURRICOLO_BURSI.secondaria];
    for (const sezione of sezioni) {
      const traguardoTrovato = sezione.traguardi.find(t => t.id === idTraguardo);
      if (traguardoTrovato) {
        return {
          competenza: sezione.competenza,
          testo: traguardoTrovato.testo
        };
      }
    }
    return null;
  };

  // 2. Estrazione dati dai tag [TAG] generati dall'AI
  const estrai = (tag) => {
    const regex = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\s*\\[|$)`);
    const match = udaFinale.match(regex);
    return match ? match[1].trim() : "---";
  };

  const contesto = estrai("CONTESTO");
  const consegna = estrai("CONSEGNA");
  const prodotto = estrai("PRODOTTO");
  const pianoTesto = estrai("PIANO_LAVORO");
  const traguardiDallAI = estrai("TRAGUARDI");

  // 3. Trasformazione Piano di Lavoro in tabella HTML
  const righePianoLavoro = pianoTesto.split("\n")
    .filter(riga => riga.includes("|"))
    .map(riga => {
      const celle = riga.split("|").map(c => c.trim());
      return `
        <tr>
          <td style="text-align:center; border:1px solid black;">${celle[0] || ""}</td>
          <td style="border:1px solid black;">${celle[1] || ""}</td>
          <td style="border:1px solid black;">${celle[2] || ""}</td>
          <td style="border:1px solid black;">${celle[3] || ""}</td>
          <td style="border:1px solid black;">${celle[4] || ""}</td>
          <td style="text-align:center; border:1px solid black;">${celle[5] || ""}</td>
        </tr>`;
    }).join("");

  // 4. Generazione Griglia Competenze con mappatura DATABASE_GRIGLIE
  const righeGrigliaCompetenze = selectedTraguardi.map(t => {
    // Gestiamo sia che selectedTraguardi sia ["TS1: testo..."] sia solo ["TS1"]
    const id = t.includes(":") ? t.split(":")[0].trim() : t.trim();
    const datiBursi = trovaDatiCurricolo(id);
    
    // Fallback se l'ID non è presente nel DATABASE_GRIGLIE
    const livelli = DATABASE_GRIGLIE[id] || { 
      iniziale: "Svolge compiti semplici solo se guidato.", 
      base: "Svolge compiti semplici in autonomia.", 
      intermedio: "Svolge compiti complessi in modo adeguato.", 
      avanzato: "Svolge compiti complessi con padronanza." 
    };

    return `
      <tr>
        <td style="border:1px solid black; background-color:#F9F9F9; font-size:9pt;">${datiBursi?.competenza || "---"}</td>
        <td style="border:1px solid black; font-weight:bold;">${datiBursi?.testo || t}</td>
        <td style="border:1px solid black;">${livelli.iniziale || livelli.iniz}</td>
        <td style="border:1px solid black;">${livelli.base}</td>
        <td style="border:1px solid black;">${livelli.intermedio || livelli.int}</td>
        <td style="border:1px solid black;">${livelli.avanzato || livelli.avanz}</td>
      </tr>`;
  }).join("");

  // 5. Costruzione HTML finale
  const htmlCompleto = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'>
    <style>
      body { font-family: "Calibri", sans-serif; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 15px; }
      td, th { border: 1px solid black; padding: 6px; font-size: 10pt; vertical-align: top; }
      .bg-grey { background-color: #E7E6E6; font-weight: bold; text-align: center; }
      .header-title { text-align: center; font-weight: bold; font-size: 16pt; text-transform: uppercase; border: 2px solid black; padding: 10px; background-color: #D9D9D9; }
    </style>
    </head>
    <body>
      <div class="header-title">MODELLO UDA<br/>IC "F. BURSI"</div>
      <br/>
      <table>
        <tr class="bg-grey"><td>Destinatari</td><td>Ore</td><td>Periodo</td><td>Materie</td></tr>
        <tr><td>Classe ${classe}ª ${scuola}</td><td>${ore} ore</td><td>${periodo || "---"}</td><td>${Array.isArray(materie) ? materie.join(", ") : materie}</td></tr>
      </table>

      <table>
        <tr><td class="bg-grey" style="width:25%">Titolo UDA</td><td><b>${titolo}</b></td></tr>
        <tr><td class="bg-grey">Situazione Problema</td><td>${contesto}</td></tr>
        <tr><td class="bg-grey">Consegna</td><td>${consegna}</td></tr>
      </table>

      <p style="font-weight:bold;">PIANO DI LAVORO:</p>
      <table>
        <tr class="bg-grey">
          <td style="width:8%">Fase</td><td style="width:15%">Materie</td><td style="width:30%">Descrizione</td><td style="width:20%">Metodi</td><td style="width:17%">Valutazione</td><td style="width:10%">Ore</td>
        </tr>
        ${righePianoLavoro}
      </table>
      
      <p><b>PRODOTTO FINALE:</b> ${prodotto}</p>

      <br clear=all style='mso-special-character:line-break;page-break-before:always'>
      
      <div class="header-title" style="font-size:14pt;">GRIGLIA DI VALUTAZIONE DELLE COMPETENZE</div>
      <br/>
      <table>
        <tr class="bg-grey">
          <td>COMPETENZA</td><td>EVIDENZE</td><td>INIZIALE</td><td>BASE</td><td>INTERMEDIO</td><td>AVANZATO</td>
        </tr>
        ${righeGrigliaCompetenze}
      </table>
    </body>
    </html>`;

  // 6. Download sicuro tramite Blob (gestisce file grandi e caratteri speciali)
  const blob = new Blob(['\ufeff', htmlCompleto], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `UDA_BURSI_${titolo.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  
  // Pulizia memoria
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 0);
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

        {/* SEZIONE AZIONI DOPPIA: SCELTA DELLA MODALITÀ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          
          {/* TASTO A: MODALITÀ CREATIVA (GENERA 3 IDEE) */}
          <button 
            onClick={handleGeneraProposte} 
            disabled={loading || !titolo}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-blue-600 rounded-3xl hover:bg-blue-50 transition-all disabled:opacity-50 shadow-sm group"
          >
            <span className="text-blue-600 font-black uppercase tracking-widest text-sm group-hover:scale-105 transition-transform">
              💡 Fammi delle proposte
            </span>
            <span className="text-[10px] text-slate-400 mt-1 italic font-sans normal-case">
              L'AI ti suggerisce 3 bozze tra cui scegliere
            </span>
          </button>

          {/* TASTO B: MODALITÀ TECNICA (COMPILAZIONE DIRETTA) */}
          <button 
            onClick={() => sviluppaUdaCompleta("COMPILAZIONE_DIRETTA: Basata rigorosamente su note docente.")} 
            disabled={loading || !titolo || selectedTraguardi.length === 0}
            className="flex flex-col items-center justify-center p-6 bg-blue-600 border-2 border-blue-600 rounded-3xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 group"
          >
            <span className="text-white font-black uppercase tracking-widest text-sm group-hover:scale-105 transition-transform">
              📝 Compila la mia UDA
            </span>
            <span className="text-blue-100 text-[10px] mt-1 italic font-sans normal-case">
              Usa le mie note e i traguardi scelti
            </span>
          </button>

        </div>

        {/* FEEDBACK VISIVO DURANTE IL CARICAMENTO */}
        {loading && (
          <div className="mt-6 text-center animate-pulse">
            <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest">
              Elaborazione in corso secondo il Curricolo IC Bursi...
            </p>
          </div>
        )}

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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase">UDA Sviluppata</h2>
              
              <div className="flex gap-4">
                {/* TASTO PER SCARICARE IL WORD */}
                <button 
                  onClick={scaricaWordCompilato}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  💾 Scarica Word
                </button>

                <button 
                  onClick={() => setUdaFinale("")} 
                  className="text-blue-600 font-bold text-sm underline hover:text-blue-800"
                >
                  Torna alle proposte
                </button>
              </div>
            </div>
            
            {/* Anteprima a video del testo generato */}
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm bg-white p-6 rounded-xl border border-slate-200 shadow-inner">
              {udaFinale}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
