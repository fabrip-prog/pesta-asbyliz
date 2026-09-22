"use client";

import { useState } from "react";
import { ArrowLeft, Check, CalendarDays, Clock, User, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";

export function BookingScreen({ services = [], availableSlots = [] }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: null,
    date: "",
    time: "",
    name: "",
    phone: ""
  });

  // Extraemos fechas que tengan horarios disponibles
  const availableDates = availableSlots.map(s => s.date).sort();
  // Al seleccionar una fecha, obtenemos sus horarios
  const availableTimes = bookingData.date 
    ? (availableSlots.find(s => s.date === bookingData.date)?.times || []) 
    : [];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  };

  const handleServiceSelect = (service) => {
    setBookingData({ ...bookingData, service });
    handleNext();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    
    // IMPORTANTE: Guardar el turno en la base de datos
    try {
      const { createAppointment } = await import("@/app/actions");
      await createAppointment({
        clientName: bookingData.name,
        clientPhone: bookingData.phone,
        date: bookingData.date,
        startTime: bookingData.time,
        service: bookingData.service,
        serviceId: bookingData.service.id
      });
    } catch (e) {
      console.error("Error al guardar el turno:", e);
    }
    
    // Aquí se generaría el link de WhatsApp manual
    const msg = `¡Hola! Quiero confirmar mi turno para ${bookingData.service?.name} el día ${bookingData.date} a las ${bookingData.time}. Mi nombre es ${bookingData.name}. Adjunto el comprobante de pago de la seña (${formatPrice(bookingData.service?.deposit)}).`;
    const whatsappUrl = `https://wa.me/3454013554?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-secondary/20 font-sans flex flex-col">
      <header className="bg-white border-b border-primary/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Reserva de Turno</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-primary/20 -z-10 transform -translate-y-1/2 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 h-1 bg-primary -z-10 transform -translate-y-1/2 transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium shadow-sm transition-colors ${
                  step >= i ? "bg-primary text-primary-foreground" : "bg-white text-foreground/40 border border-primary/20"
                }`}
              >
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-foreground/60 px-1">
            <span>Servicio</span>
            <span>Fecha/Hora</span>
            <span>Tus Datos</span>
            <span>Confirmación</span>
          </div>
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-foreground mb-6">¿Qué servicio deseas realizarte?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white p-5 rounded-2xl border border-primary/20 hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full text-foreground/70 uppercase tracking-wider">{service.category}</span>
                  </div>
                  <p className="text-sm text-foreground/60 mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-1 inline" /> {service.duration}
                  </p>
                  <div className="flex justify-between items-end border-t border-primary/10 pt-3">
                    <div>
                      <p className="text-xs text-foreground/50">Seña requerida</p>
                      <p className="font-medium text-primary">{formatPrice(service.deposit)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-foreground/50">Total</p>
                      <p className="font-semibold text-foreground">{formatPrice(service.price)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Date and Time */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-foreground mb-2">Selecciona Fecha y Hora</h2>
            <p className="text-foreground/60 mb-6">Servicio seleccionado: <span className="font-medium text-foreground">{bookingData.service?.name}</span></p>
            
            <div className="bg-white p-6 rounded-2xl border border-primary/20 mb-6 shadow-sm">
              <h3 className="font-medium text-foreground mb-4 flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-primary"/> Días Disponibles</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => setBookingData({...bookingData, date})}
                    className={`flex-shrink-0 px-5 py-3 rounded-xl border transition-colors ${
                      bookingData.date === date 
                        ? "border-primary bg-primary/10 text-primary font-medium" 
                        : "border-primary/20 text-foreground/70 hover:bg-secondary/50"
                    }`}
                  >
                    {new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </button>
                ))}
              </div>

              {bookingData.date && (
                <div className="mt-8 animate-in fade-in">
                  <h3 className="font-medium text-foreground mb-4 flex items-center"><Clock className="h-5 w-5 mr-2 text-primary"/> Horarios Disponibles</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setBookingData({...bookingData, time})}
                        className={`py-2 rounded-xl border transition-colors ${
                          bookingData.time === time 
                            ? "border-primary bg-primary text-primary-foreground font-medium shadow-sm" 
                            : "border-primary/20 text-foreground/70 hover:bg-secondary/50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-full font-medium text-foreground/70 hover:bg-black/5 transition-colors">Volver</button>
              <button 
                onClick={handleNext} 
                disabled={!bookingData.date || !bookingData.time}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Client Info */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-foreground mb-2">Tus Datos</h2>
            <p className="text-foreground/60 mb-6">Para agendar tu turno para el {new Date(bookingData.date + 'T12:00:00').toLocaleDateString()} a las {bookingData.time}.</p>
            
            <div className="bg-white p-6 rounded-2xl border border-primary/20 mb-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Ingresa tu nombre"
                    value={bookingData.name}
                    onChange={e => setBookingData({...bookingData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Teléfono / WhatsApp</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Ingresa tu teléfono"
                    value={bookingData.phone}
                    onChange={e => setBookingData({...bookingData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-full font-medium text-foreground/70 hover:bg-black/5 transition-colors">Volver</button>
              <button 
                onClick={handleNext} 
                disabled={!bookingData.name || !bookingData.phone}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Revisar Reserva
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation & Payment */}
        {step === 4 && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-foreground mb-2">Confirmación y Pago de Seña</h2>
            <p className="text-foreground/60 mb-6">Tu turno queda reservado únicamente tras el pago de la seña.</p>
            
            <div className="bg-white p-6 rounded-2xl border border-primary/20 mb-6 shadow-sm">
              <h3 className="font-semibold text-lg border-b border-primary/10 pb-3 mb-4">Resumen del Turno</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Servicio:</span>
                  <span className="font-medium">{bookingData.service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Fecha:</span>
                  <span className="font-medium">{bookingData.date ? new Date(bookingData.date + 'T12:00:00').toLocaleDateString() : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Hora:</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">A nombre de:</span>
                  <span className="font-medium">{bookingData.name}</span>
                </div>
              </div>

              <div className="bg-secondary/40 p-4 rounded-xl border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total del Servicio:</span>
                  <span className="font-semibold">{formatPrice(bookingData.service?.price)}</span>
                </div>
                <div className="flex justify-between items-center text-lg text-primary mt-2 pt-2 border-t border-primary/20">
                  <span className="font-bold flex items-center"><CreditCard className="h-5 w-5 mr-2" /> Seña a abonar hoy:</span>
                  <span className="font-bold">{formatPrice(bookingData.service?.deposit)}</span>
                </div>
                <p className="text-xs text-foreground/50 text-right mt-1">El resto se abona en el local el día del turno.</p>
              </div>
            </div>

            <div className="bg-[#009EE3]/10 p-5 rounded-2xl border border-[#009EE3]/20 mb-8">
              <h4 className="font-medium text-[#009EE3] mb-2 flex items-center">
                Instrucciones de Pago
              </h4>
              <p className="text-sm text-foreground/70 mb-4">
                1. Haz clic en el botón de Mercado Pago para abonar la seña de <strong>{formatPrice(bookingData.service?.deposit)}</strong>.<br/>
                2. Toma captura de pantalla del comprobante.<br/>
                3. Haz clic en "Confirmar vía WhatsApp" y envíanos la captura.
              </p>
              
              {/* Botón de Mercado Pago simulado */}
              <a 
                href="https://mpago.la/1KJGLhG" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#009EE3] text-white py-3 rounded-xl font-medium hover:bg-[#0088CC] transition-colors mb-3"
              >
                Pagar Seña con Mercado Pago
              </a>
            </div>

            <div className="flex justify-between flex-col-reverse sm:flex-row gap-4">
              <button onClick={handleBack} className="px-6 py-3 rounded-full font-medium text-foreground/70 hover:bg-black/5 transition-colors w-full sm:w-auto">Volver</button>
              <button 
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full bg-[#25D366] text-white font-medium shadow-md transition-colors hover:bg-[#20bd5a] flex items-center justify-center w-full sm:w-auto gap-2 disabled:opacity-50"
              >
                {isSubmitting ? "Procesando..." : "Enviar Comprobante por WhatsApp"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
