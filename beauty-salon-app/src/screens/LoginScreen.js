"use client";

import { useState } from "react";
import { Sparkles, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    if (username === "admin" && password === "admin123") {
      document.cookie = "admin_auth=true; path=/";
      router.push("/admin/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-primary/20">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Acceso Panel Admin</h1>
          <p className="text-foreground/60 text-sm mt-2">Pestañas By Liz</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-accent transition-colors shadow-md"
          >
            <Sparkles className="h-5 w-5" />
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
