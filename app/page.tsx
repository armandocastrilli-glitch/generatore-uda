"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Creiamo il client Supabase direttamente qui per ora
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("Verifica...");
    
    const { data, error } = await supabase
      .from("invitation_codes")
      .select("*")
      .eq("code", code)
      .eq("is_used", false)
      .single();

    if (error || !data) {
      setMessage("Codice errato o non trovato.");
    } else {
      setMessage("Accesso autorizzato!");
      // Prossimo passo: redirect alla pagina del generatore
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 text-center">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6">UDA Generator</h1>
        <input 
          type="text" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder="Inserisci codice docente"
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          Accedi
        </button>
        {message && <p className="mt-4 font-semibold text-blue-600">{message}</p>}
      </div>
    </div>
  );
}