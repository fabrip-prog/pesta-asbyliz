"use client";

import { useState, useEffect } from "react";
import { Calendar, Settings, Image as ImageIcon, LogOut, Plus, Edit, X, Trash2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAppointment, getAppointments, getServices, createService, deleteService, addGalleryWork, getGallery, getAvailableSlots, saveAvailableSlots, checkDbStatus, deleteAvailableSlot } from "@/app/actions";

export function AdminScreen() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showModal, setShowModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dbStatus, setDbStatus] = useState({ hasToken: true });
  
  const [formData, setFormData] = useState({ clientName: "", clientPhone: "", date: "", startTime: "", service: { name: "Manual" } });
  const [serviceData, setServiceData] = useState({ name: "", category: "pestanas", price: "", deposit: "", duration: "60 min" });
  const [galleryData, setGalleryData] = useState({ title: "", description: "", image: "" });
  const [availabilityData, setAvailabilityData] = useState({ date: "", times: "09:00, 10:30, 14:00, 16:00" });
  
  const router = useRouter();

  const loadData = () => {
    getAppointments().then(data => setAppointments(data));
    getServices().then(data => setServices(data));
    getGallery().then(data => setGallery(data));
    getAvailableSlots().then(data => setAvailableSlots(data));
    checkDbStatus().then(data => setDbStatus(data));
  };

  useEffect(() => {
    loadData();
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

  const handleDeleteService = async (id) => {
    if(confirm("¿Seguro que deseas eliminar este servicio?")) {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGalleryData({...galleryData, image: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGalleryItem = async (e) => {
    e.preventDefault();
    if (!galleryData.image) return alert("Sube una foto primero");
    const newItem = await addGalleryWork(galleryData);
    setGallery([...gallery, newItem]);
    setGalleryData({ title: "", description: "", image: "" });
  };

  const handleSaveAvailability = async (e) => {
    e.preventDefault();
    const timesArray = availabilityData.times.split(",").map(t => t.trim()).filter(t => t.length > 0);
    await saveAvailableSlots(availabilityData.date, timesArray);
    setShowAvailabilityModal(false);
    alert("Horarios guardados correctamente");
    setAvailabilityData({ date: "", times: "09:00, 10:30, 14:00, 16:00" });
    loadData(); // Reload available slots
  };

  const handleDeleteAvailability = async (date) => {
    if(confirm(`¿Seguro que deseas eliminar los horarios del ${date}?`)) {
      await deleteAvailableSlot(date);
      loadData();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex relative font-sans">
      {/* Sidebar and rest of UI remains the same... */}
      <aside className="w-64 bg-white border-r border-primary/20 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-primary/10">
          <h2 className="text-xl font-bold text-foreground">Panel Admin</h2>
          <p className="text-sm text-foreground/60">Pestañas By Liz</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab("calendar")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "calendar" ? "bg-primary text-primary-foreground font-medium" : "text-foreground/70 hover:bg-secondary/50"}`}>
            <Calendar className="h-5 w-5" /> Agenda y Turnos
          </button>
          <button onClick={() => setActiveTab("gallery")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "gallery" ? "bg-primary text-primary-foreground font-medium" : "text-foreground/70 hover:bg-secondary/50"}`}>
            <ImageIcon className="h-5 w-5" /> Galería de Trabajos
          </button>
          <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "settings" ? "bg-primary text-primary-foreground font-medium" : "text-foreground/70 hover:bg-secondary/50"}`}>
            <Settings className="h-5 w-5" /> Servicios y Precios
          </button>
        </nav>

        <div className="p-4 border-t border-primary/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Tab Selector */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab("calendar")} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === "calendar" ? "bg-primary text-white" : "bg-white text-foreground/70"}`}>Agenda</button>
          <button onClick={() => setActiveTab("gallery")} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === "gallery" ? "bg-primary text-white" : "bg-white text-foreground/70"}`}>Galería</button>
          <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${activeTab === "settings" ? "bg-primary text-white" : "bg-white text-foreground/70"}`}>Servicios</button>
        </div>

        {activeTab === "calendar" && (
          <div className="animate-in fade-in duration-300">
            {!dbStatus.hasToken && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
                <p className="font-bold">⚠️ Base de datos no conectada</p>
                <p className="text-sm">Vercel Blob no está funcionando. Los cambios no se guardarán. Haz "Redeploy" en Vercel para aplicar la conexión.</p>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Agenda de Turnos</h1>
              <div className="flex gap-2">
                <button onClick={() => setShowAvailabilityModal(true)} className="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/5 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Cargar Horarios Libres
                </button>
                <button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Turno Manual
                </button>
              </div>
            </div>
            
            {/* Horarios Libres */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 mb-6">
              <h3 className="font-medium text-foreground mb-4">Días y Horarios Disponibles para Reservar</h3>
              {availableSlots && availableSlots.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {availableSlots.map(slot => (
                    <div key={slot.date} className="bg-secondary/10 border border-primary/20 rounded-xl p-3 min-w-[150px] relative">
                      <button onClick={() => handleDeleteAvailability(slot.date)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <p className="font-semibold text-primary">{slot.date}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {slot.times.map(t => (
                          <span key={t} className="text-xs bg-white border border-primary/10 px-2 py-1 rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/60 text-sm">No has cargado horarios libres aún. Haz clic en "Cargar Horarios Libres" arriba.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 min-h-[400px]">
              <h3 className="font-medium text-foreground mb-4">Turnos Agendados ({appointments.length})</h3>
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
                <p className="text-foreground/60 text-center mt-10">No hay turnos registrados aún.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-6">Gestión de Galería</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 h-fit">
                <h3 className="font-medium mb-4">Subir Nuevo Trabajo</h3>
                <form onSubmit={handleCreateGalleryItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre (ej. Cliente o Servicio)</label>
                    <input required type="text" value={galleryData.title} onChange={e => setGalleryData({...galleryData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Ej: Volumen Ruso - María"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descripción Breve</label>
                    <textarea value={galleryData.description} onChange={e => setGalleryData({...galleryData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" rows="2" placeholder="Fibras 0.05, curvatura D..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Foto del Trabajo</label>
                    <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center cursor-pointer relative hover:bg-secondary/10 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {galleryData.image ? (
                        <img src={galleryData.image} alt="Preview" className="h-32 object-contain mx-auto rounded-lg" />
                      ) : (
                        <div>
                          <ImageIcon className="h-8 w-8 text-primary/50 mx-auto mb-2" />
                          <p className="text-sm text-foreground font-medium">Toca para seleccionar foto de tu celular</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent mt-4">Guardar Trabajo</button>
                </form>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
                <h3 className="font-medium mb-4">Trabajos Subidos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {gallery.length > 0 ? gallery.slice().reverse().map((item) => (
                    <div key={item.id} className="rounded-xl overflow-hidden border border-primary/20 relative group">
                      <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div>
                          <p className="text-white text-sm font-medium truncate">{item.title}</p>
                          <p className="text-white/80 text-xs truncate">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                     <p className="text-foreground/60 text-sm text-center col-span-2 py-8">La galería está vacía.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-2xl font-bold text-foreground mb-6">Servicios, Precios y Señas</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-secondary/30 text-foreground text-sm border-b border-primary/10">
                      <th className="p-4 font-medium">Servicio</th>
                      <th className="p-4 font-medium">Categoría</th>
                      <th className="p-4 font-medium">Precio Total</th>
                      <th className="p-4 font-medium">Seña Requerida</th>
                      <th className="p-4 font-medium text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc) => (
                      <tr key={svc.id} className="border-b border-primary/5">
                        <td className="p-4 text-sm font-medium">{svc.name}</td>
                        <td className="p-4 text-sm capitalize">{svc.category}</td>
                        <td className="p-4 text-sm">{formatPrice(svc.price)}</td>
                        <td className="p-4 text-sm text-primary">{formatPrice(svc.deposit)}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteService(svc.id)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors" title="Eliminar servicio">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-secondary/10">
                <button onClick={() => setShowServiceModal(true)} className="text-sm font-medium text-primary flex items-center gap-1 hover:text-accent">
                  <Plus className="h-4 w-4" /> Agregar nuevo servicio
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals ... */}
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
      {/* Modal Cargar Horarios */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Cargar Horarios Libres</h3>
              <button onClick={() => setShowAvailabilityModal(false)} className="text-foreground/50 hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-foreground/60 mb-4">Define qué horarios mostrarás disponibles para reservar en un día específico.</p>
            <form onSubmit={handleSaveAvailability} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Día (Fecha)</label>
                <input required type="date" value={availabilityData.date} onChange={e => setAvailabilityData({...availabilityData, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Horarios Disponibles</label>
                <input required type="text" value={availabilityData.times} onChange={e => setAvailabilityData({...availabilityData, times: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="09:00, 10:30, 14:00" />
                <p className="text-xs text-foreground/50 mt-1">Separa las horas con comas (ej. 09:00, 10:30, 15:00)</p>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent mt-4">Guardar Disponibilidad</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
