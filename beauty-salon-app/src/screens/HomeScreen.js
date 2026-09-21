import { CalendarDays, Star, Sparkles, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HomeScreen() {
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
                  <p className="text-sm text-foreground/70">Av. Principal 123, Centro</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-white/60 p-4 shadow-sm border border-primary/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Horario</h3>
                  <p className="text-sm text-foreground/70">Lun a Sáb: 9:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section id="servicios" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Nuestros Servicios</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Ofrecemos tratamientos personalizados para realzar tu belleza y cuidar tu piel con los mejores productos del mercado.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="group rounded-3xl bg-secondary/30 p-8 transition-colors hover:bg-secondary">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-3">Pestañas</h3>
                <p className="text-foreground/70 mb-6">
                  Extensiones clásicas, volumen ruso, lifting y tinte. Diseño personalizado según tu tipo de ojo.
                </p>
                <Link href="/reserva?categoria=pestanas" className="inline-flex items-center text-primary font-medium group-hover:text-accent">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Service 2 */}
              <div className="group rounded-3xl bg-secondary/30 p-8 transition-colors hover:bg-secondary">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <Star className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-3">Cejas</h3>
                <p className="text-foreground/70 mb-6">
                  Perfilado, laminado, henna y microblading. Diseñamos la estructura perfecta para tu rostro.
                </p>
                <Link href="/reserva?categoria=cejas" className="inline-flex items-center text-primary font-medium group-hover:text-accent">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Service 3 */}
              <div className="group rounded-3xl bg-secondary/30 p-8 transition-colors hover:bg-secondary">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-3">Cosmetología</h3>
                <p className="text-foreground/70 mb-6">
                  Limpieza facial profunda, dermaplaning, peeling y tratamientos anti-age adaptados a tu piel.
                </p>
                <Link href="/reserva?categoria=cosmetologia" className="inline-flex items-center text-primary font-medium group-hover:text-accent">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-12">
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
            {/* Hidden admin access */}
            <Link 
              href="/admin" 
              className="absolute right-0 bottom-0 w-8 h-8 opacity-0"
              title="Acceso Admin"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
