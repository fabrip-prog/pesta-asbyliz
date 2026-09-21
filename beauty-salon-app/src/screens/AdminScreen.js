"use client";

import { useState } from "react";
import { Calendar, Settings, Image as ImageIcon, LogOut, Plus, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminScreen() {
  const [activeTab, setActiveTab] = useState("calendar");
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-primary/20 flex flex-col">
        <div className="p-6 border-b border-primary/10">
          <h2 className="text-xl font-bold text-foreground">Panel Admin</h2>
          <p className="text-sm text-foreground/60">Pestañas By Liz</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("calendar")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "calendar" 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-foreground/70 hover:bg-secondary/50"
            }`}
          >
            <Calendar className="h-5 w-5" />
            Agenda y Turnos
          </button>
          
          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "gallery" 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-foreground/70 hover:bg-secondary/50"
            }`}
          >
            <ImageIcon className="h-5 w-5" />
            Galería
          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "settings" 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-foreground/70 hover:bg-secondary/50"
            }`}
          >
            <Settings className="h-5 w-5" />
            Servicios y Precios
          </button>
        </nav>

        <div className="p-4 border-t border-primary/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "calendar" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Agenda de Turnos</h1>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent flex items-center gap-2">
                <Plus className="h-4 w-4" /> Nuevo Turno Manual
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 min-h-[500px]">
              <p className="text-foreground/60 text-center mt-20">
                El calendario interactivo se mostrará aquí (conectado a la base de datos).
              </p>
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-6">Gestión de Galería</h1>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center">
                <ImageIcon className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                <p className="text-foreground font-medium">Arrastra fotos aquí o haz clic para subir</p>
                <p className="text-sm text-foreground/60 mt-2">Formatos soportados: JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-6">Servicios, Precios y Señas</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 text-foreground text-sm border-b border-primary/10">
                    <th className="p-4 font-medium">Servicio</th>
                    <th className="p-4 font-medium">Categoría</th>
                    <th className="p-4 font-medium">Precio Total</th>
                    <th className="p-4 font-medium">Seña Requerida</th>
                    <th className="p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary/5">
                    <td className="p-4 text-sm">Extensiones Clásicas</td>
                    <td className="p-4 text-sm">Pestañas</td>
                    <td className="p-4 text-sm font-medium">$15.000</td>
                    <td className="p-4 text-sm text-primary font-medium">$5.000</td>
                    <td className="p-4">
                      <button className="text-blue-500 hover:text-blue-700 p-1"><Edit className="h-4 w-4" /></button>
                    </td>
                  </tr>
                  <tr className="border-b border-primary/5">
                    <td className="p-4 text-sm">Perfilado de Cejas</td>
                    <td className="p-4 text-sm">Cejas</td>
                    <td className="p-4 text-sm font-medium">$8.000</td>
                    <td className="p-4 text-sm text-primary font-medium">$3.000</td>
                    <td className="p-4">
                      <button className="text-blue-500 hover:text-blue-700 p-1"><Edit className="h-4 w-4" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-secondary/10">
                <button className="text-sm font-medium text-primary flex items-center gap-1 hover:text-accent">
                  <Plus className="h-4 w-4" /> Agregar nuevo servicio
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
