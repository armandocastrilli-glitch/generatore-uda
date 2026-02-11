"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClientComponentClient();

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
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Generatore UDA - Accesso</h1>
      <input 
        type="text" 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        placeholder="Inserisci codice"
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button 
        onClick={handleLogin}
        style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Accedi
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}