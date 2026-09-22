"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Star, Sparkles, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAvailableSlots, getServices, getGallery } from "@/app/actions";

const categoryLabels = {
  pestanas: "Pestañas",
  cejas: "Cejas",
  cosmetologia: "Cosmetología"
};

const categoryIcons = {
  pestanas: Sparkles,
  cejas: Star,
  cosmetologia: Sparkles
};

export function HomeScreen() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    getAvailableSlots().then(data => setAvailableSlots(data || []));
    getServices().then(data => setServices(data || []));
    getGallery().then(data => setGallery(data || []));
  }, []);

  // Ordenar por fecha y mostrar solo fechas futuras
  const today = new Date().toISOString().split('T')[0];
  const upcomingSlots = availableSlots
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Agrupar servicios por categoría
  const categories = [...new Set(services.map(s => s.category))];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground tracking-wide">Pestañas By Liz</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#servicios" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Servicios</Link>
            <Link href="#galeria" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Galería</Link>
            <Link href="#turnos" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Disponibilidad</Link>
            <Link href="#contacto" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contacto</Link>
          </nav>
          <Link 
            href="/reserva" 
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-accent"
          >
            Reservar Turno
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-secondary to-background">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-sm text-foreground/80 mb-6">
              <Star className="h-4 w-4 text-primary mr-2 fill-primary" />
              Especialistas en tu mirada
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 max-w-3xl">
              Resalta tu belleza natural con <span className="text-primary">Pestañas By Liz</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl">
              Estudio de estética especializado en extensiones de pestañas, diseño de cejas y tratamientos cosmetológicos de vanguardia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/reserva" 
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                Agendar ahora
              </Link>
              <Link 
                href="#servicios" 
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary/50 bg-background px-8 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Ver servicios
              </Link>
            </div>
            
            {/* Quick Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-left">
              <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4 shadow-sm border border-primary/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Ubicación</h3>
                  <p className="text-sm text-foreground/70">San Luis y Manuel Belgrano, Gdor. Castro</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4 shadow-sm border border-primary/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Horario</h3>
                  <p className="text-sm text-foreground/70">Lun a Sáb</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DISPONIBILIDAD DE TURNOS */}
        <section id="turnos" className="py-16 bg-secondary/10 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">Turnos Disponibles</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Consultá los días y horarios disponibles para agendar tu turno. ¡Reservá el tuyo antes de que se agoten!
              </p>
            </div>
            
            {upcomingSlots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {upcomingSlots.map((slot) => {
                  const dateObj = new Date(slot.date + 'T12:00:00');
                  const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
                  const dayNum = dateObj.getDate();
                  const monthName = dateObj.toLocaleDateString('es-ES', { month: 'short' });

                  return (
                    <div key={slot.date} className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-primary/10 px-4 py-3 text-center border-b border-primary/10">
                        <p className="text-xs uppercase tracking-wider text-primary/70 font-medium">{dayName}</p>
                        <p className="text-2xl font-bold text-primary">{dayNum}</p>
                        <p className="text-xs text-foreground/60 capitalize">{monthName}</p>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {slot.times.map(time => (
                            <span key={time} className="text-sm bg-secondary/50 text-foreground/80 px-3 py-1 rounded-full border border-primary/10">
                              {time}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-foreground/50 text-center mt-3">
                          {slot.times.length} {slot.times.length === 1 ? 'horario disponible' : 'horarios disponibles'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">No hay turnos disponibles en este momento. ¡Volvé a consultar pronto!</p>
            )}

            <div className="text-center mt-8">
              <Link 
                href="/reserva" 
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-transform hover:scale-105"
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                Reservar mi turno
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICIOS Y GALERÍA */}
        <section id="servicios" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Nuestros Servicios</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Conocé todos nuestros tratamientos y mirá los resultados de nuestro trabajo.
              </p>
            </div>
            
            {categories.length > 0 ? (
              <div className="space-y-16">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat] || Sparkles;
                  const catServices = services.filter(s => s.category === cat);
                  const catGallery = gallery.filter(g => {
                    // Intentar matchear por título del trabajo con el nombre del servicio
                    const titleLower = (g.title || '').toLowerCase();
                    return catServices.some(s => titleLower.includes(s.name.toLowerCase())) || 
                           titleLower.includes(cat.toLowerCase()) ||
                           titleLower.includes((categoryLabels[cat] || cat).toLowerCase());
                  });

                  return (
                    <div key={cat} className="scroll-mt-20" id={`cat-${cat}`}>
                      {/* Categoría Header */}
                      <div className="flex items-center gap-3 mb-8">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                          {categoryLabels[cat] || cat}
                        </h3>
                      </div>

                      {/* Servicios de esta categoría */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {catServices.map(svc => (
                          <div key={svc.id} className="bg-white rounded-2xl p-5 border border-primary/15 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-foreground">{svc.name}</h4>
                              <span className="text-xs bg-secondary px-2 py-1 rounded-full text-foreground/60 whitespace-nowrap ml-2">
                                {svc.duration}
                              </span>
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-xs text-foreground/50">Seña</p>
                                <p className="text-sm font-medium text-primary">{formatPrice(svc.deposit)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-foreground/50">Precio total</p>
                                <p className="text-lg font-bold text-foreground">{formatPrice(svc.price)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Galería de trabajos de esta categoría */}
                      {catGallery.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-foreground/60 mb-3 flex items-center gap-2">
                            📸 Trabajos realizados
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {catGallery.map(item => (
                              <div key={item.id} className="rounded-xl overflow-hidden border border-primary/15 group relative aspect-square">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div>
                                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                    {item.description && <p className="text-white/70 text-xs truncate">{item.description}</p>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">Cargando servicios...</p>
            )}

            {/* Galería general (trabajos sin categoría asignada) */}
            {gallery.length > 0 && (() => {
              const categorizedIds = new Set();
              categories.forEach(cat => {
                const catServices = services.filter(s => s.category === cat);
                gallery.forEach(g => {
                  const titleLower = (g.title || '').toLowerCase();
                  if (catServices.some(s => titleLower.includes(s.name.toLowerCase())) || 
                      titleLower.includes(cat.toLowerCase()) ||
                      titleLower.includes((categoryLabels[cat] || cat).toLowerCase())) {
                    categorizedIds.add(g.id);
                  }
                });
              });
              const uncategorized = gallery.filter(g => !categorizedIds.has(g.id));
              
              if (uncategorized.length === 0) return null;

              return (
                <div className="mt-16" id="galeria">
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">Más Trabajos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
                    {uncategorized.map(item => (
                      <div key={item.id} className="rounded-xl overflow-hidden border border-primary/15 group relative aspect-square">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div>
                            <p className="text-white text-sm font-medium truncate">{item.title}</p>
                            {item.description && <p className="text-white/70 text-xs truncate">{item.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-12 relative group">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold tracking-wide">Pestañas By Liz</span>
          </div>
          <p className="text-background/60 mb-6 max-w-md mx-auto">
            Tu belleza, nuestra pasión. Reserva tu turno hoy y déjanos consentirte.
          </p>
          <div className="pt-8 border-t border-background/10 text-sm text-background/40 relative">
            &copy; {new Date().getFullYear()} Pestañas By Liz. Todos los derechos reservados.
          </div>
        </div>
        
        {/* Subtle admin access */}
        <div className="absolute bottom-4 right-4 opacity-5 hover:opacity-100 transition-opacity">
          <Link href="/admin" title="Panel de Administración">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  );
}
