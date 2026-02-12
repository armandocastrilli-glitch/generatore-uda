"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
    try {
      const { data, error } = await supabase
        .from("invitation_codes")
        .select("*")
        .eq("code", code.trim())
        .eq("is_used", false)
        .single();

      if (error || !data) {
        setMessage("Codice errato o già utilizzato.");
        setIsLoading(false);
      } else {
        setMessage("Accesso autorizzato! Reindirizzamento...");
        setTimeout(() => router.push("/generatore"), 1500);
      }
    } catch (err) {
      setMessage("Errore di connessione.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 text-center text-slate-900">
        <h1 className="text-3xl font-black mb-2">UDA Generator</h1>
        <p className="text-slate-500 mb-8">I.C. "F. Bursi" - Portale Docenti</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Codice Istituzionale"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-center font-mono text-lg focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={isLoading || !code}
            className={`w-full font-bold py-4 rounded-2xl transition-all ${isLoading || !code ? "bg-slate-200 text-slate-400" : "bg-blue-600 text-white shadow-lg shadow-blue-200"}`}
          >
            {isLoading ? "Verifica..." : "Accedi al Sistema"}
          </button>
        </form>
        {message && <div className="mt-6 p-4 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 border border-blue-100">{message}</div>}
      </div>
    </main>
  );
}
