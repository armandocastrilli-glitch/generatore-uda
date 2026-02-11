"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Definiamo la struttura del codice per far stare calmo Vercel
interface InvitationCode {
  id: number;
  code: string;
  is_used: boolean;
}

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    setMessage("Verifica in corso...");
    
    // Specifichiamo il tipo <InvitationCode> per evitare errori di build
    const { data, error } = await supabase
      .from("invitation_codes")
      .select("*")
      .eq("code", code)
      .eq("is_used", false)
      .returns<InvitationCode[]>() 
      .single();

    if (error) {
      console.error("Errore Supabase:", error);
      setMessage("Codice errato o non trovato.");
      return;
    }

    if (data) {
      setMessage("Accesso autorizzato! Caricamento generatore...");
      // In futuro qui metteremo il reindirizzamento: router.push('/generatore');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
            UDA Generator
          </h1>
          <p className="text-slate-500 mt-2">I.C. "F. Bursi" - Portale Docenti</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">
              Codice di Accesso
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Inserisci il codice istituzionale"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            Accedi al Sistema
          </button>

          {message && (
            <div className={`p-3 rounded-lg text-center text-sm font-semibold animate-pulse ${
              message.includes("autorizzato") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400">
          Uso riservato al personale docente autorizzato.
        </p>
      </div>
    </div>
  );
}