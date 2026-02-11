"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    // Controlliamo se il codice esiste nella tabella invitation_codes
    const { data, error } = await supabase
      .from("invitation_codes")
      .select("*")
      .eq("code", code)
      .eq("is_used", false)
      .single();

    if (data) {
      setMessage("Accesso autorizzato! Caricamento generatore...");
      // Qui aggiungeremo il passaggio alla pagina successiva
    } else {
      setMessage("Codice errato o già utilizzato. Riprova.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Generatore UDA - Accesso Docenti
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Inserisci il codice fornito dall'amministratore per iniziare.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Es: DOCENTE_BURSI_01"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Accedi al Generatore
        </button>
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("autorizzato") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}