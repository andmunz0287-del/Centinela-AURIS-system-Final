import { Card } from "@/components/ui/card"

export function SystemGallery() {
  return (
    <section id="system" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Vista del <span className="text-primary">Sistema</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Interfaz intuitiva y poderosa para el control total de tu seguridad
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="p-2 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
            <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
              <img
                src="/security-monitoring-dashboard-dark-interface.jpg"
                alt="Dashboard de monitoreo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">Panel de Control</h3>
                <p className="text-sm text-muted-foreground">Monitoreo en tiempo real de todas las cámaras</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
            <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
              <img
                src="/ai-detection-alerts-interface-dark.jpg"
                alt="Sistema de alertas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">Detección IA</h3>
                <p className="text-sm text-muted-foreground">Identificación automática de eventos</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
            <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
              <img
                src="/analytics-graphs-security-data-dark.jpg"
                alt="Análisis y reportes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">Análisis Avanzado</h3>
                <p className="text-sm text-muted-foreground">Reportes detallados y estadísticas</p>
              </div>
            </div>
          </Card>

          <Card className="p-2 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group overflow-hidden">
            <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
              <img
                src="/mobile-app-security-monitoring-dark.jpg"
                alt="App móvil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">Control Móvil</h3>
                <p className="text-sm text-muted-foreground">Acceso desde cualquier dispositivo</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
