"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Inizializzazione del client Supabase con le variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setMessage("Verifica del codice in corso...");

    try {
      // Interroga la tabella invitation_codes per trovare il codice inserito
      const { data, error } = await supabase
        .from("invitation_codes")
        .select("*")
        .eq("code", code.trim())
        .eq("is_used", false)
        .single();

      if (error || !data) {
        setMessage("Codice errato, inesistente o già utilizzato.");
        setIsLoading(false);
      } else {
        setMessage("Accesso autorizzato! Reindirizzamento...");
        
        // Piccola pausa per dare feedback visivo all'utente
        setTimeout(() => {
          router.push("/generatore");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Errore di connessione al database.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-4">
            <svg 
              className="w-10 h-10 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            UDA Generator
          </h1>
          <p className="text-slate-500 mt-2 font-medium">I.C. "F. Bursi" - Portale Docenti</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
              Codice di Accesso Istituzionale
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Es: BURSI_2026_DOC"
              disabled={isLoading}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-mono placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !code}
            className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
              isLoading || !code
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
            }`}
          >
            {isLoading ? "Verifica..." : "Accedi al Sistema"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold animate-in fade-in slide-in-from-bottom-2 duration-300 ${
            message.includes("autorizzato") 
              ? "bg-green-50 text-green-700 border border-green-100" 
              : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            {message}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Sicurezza Crittografata Supabase
          </p>
        </div>
      </div>
    </main>
  );
}