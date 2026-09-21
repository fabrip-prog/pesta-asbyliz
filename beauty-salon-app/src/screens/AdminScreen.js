"use client";

import { useState, useEffect } from "react";
import { Calendar, Settings, Image as ImageIcon, LogOut, Plus, Edit, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAppointment, getAppointments, getServices, createService } from "@/app/actions";

export function AdminScreen() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showModal, setShowModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  
  const [formData, setFormData] = useState({ clientName: "", clientPhone: "", date: "", startTime: "", service: { name: "Manual" } });
  const [serviceData, setServiceData] = useState({ name: "", category: "pestanas", price: "", deposit: "", duration: "60 min" });
  
  const router = useRouter();

  useEffect(() => {
    getAppointments().then(data => setAppointments(data));
    getServices().then(data => setServices(data));
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin");
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    const newAppt = await createAppointment(formData);
    setAppointments([...appointments, newAppt]);
    setShowModal(false);
    setFormData({ clientName: "", clientPhone: "", date: "", startTime: "", service: { name: "Manual" } });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    const newSvc = await createService(serviceData);
    setServices([...services, newSvc]);
    setShowServiceModal(false);
    setServiceData({ name: "", category: "pestanas", price: "", deposit: "", duration: "60 min" });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex relative">
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
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "calendar" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Agenda de Turnos</h1>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Nuevo Turno Manual
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 min-h-[500px]">
              <h3 className="font-medium text-foreground mb-4">Turnos Registrados ({appointments.length})</h3>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice().reverse().map((appt, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border border-primary/20 rounded-xl bg-secondary/5">
                      <div>
                        <p className="font-semibold">{appt.clientName}</p>
                        <p className="text-sm text-foreground/60">{appt.service?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary bg-primary/10 px-3 py-1 rounded-full text-sm inline-block">{appt.date} a las {appt.startTime}</p>
                        <p className="text-xs text-foreground/50 mt-1">{appt.clientPhone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60 text-center mt-20">No hay turnos registrados aún.</p>
              )}
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
                  {services.map((svc) => (
                    <tr key={svc.id} className="border-b border-primary/5">
                      <td className="p-4 text-sm">{svc.name}</td>
                      <td className="p-4 text-sm capitalize">{svc.category}</td>
                      <td className="p-4 text-sm font-medium">{formatPrice(svc.price)}</td>
                      <td className="p-4 text-sm text-primary font-medium">{formatPrice(svc.deposit)}</td>
                      <td className="p-4">
                        <button className="text-blue-500 hover:text-blue-700 p-1"><Edit className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-secondary/10">
                <button 
                  onClick={() => setShowServiceModal(true)}
                  className="text-sm font-medium text-primary flex items-center gap-1 hover:text-accent"
                >
                  <Plus className="h-4 w-4" /> Agregar nuevo servicio
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Turno Manual */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Agregar Turno Manual</h3>
              <button onClick={() => setShowModal(false)} className="text-foreground/50 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Servicio</label>
                <input required type="text" value={formData.service.name} onChange={e => setFormData({...formData, service: { name: e.target.value }})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha (YYYY-MM-DD)</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora (HH:MM)</label>
                  <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent mt-4">Guardar Turno</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Servicio */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Agregar Servicio</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-foreground/50 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Servicio</label>
                <input required type="text" value={serviceData.name} onChange={e => setServiceData({...serviceData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select required value={serviceData.category} onChange={e => setServiceData({...serviceData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                  <option value="pestanas">Pestañas</option>
                  <option value="cejas">Cejas</option>
                  <option value="cosmetologia">Cosmetología</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Total ($)</label>
                  <input required type="number" min="0" value={serviceData.price} onChange={e => setServiceData({...serviceData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seña Requerida ($)</label>
                  <input required type="number" min="0" value={serviceData.deposit} onChange={e => setServiceData({...serviceData, deposit: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent mt-4">Guardar Servicio</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
