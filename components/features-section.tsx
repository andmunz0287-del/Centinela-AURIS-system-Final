import { Card } from "@/components/ui/card"
import { Eye, Clock, Bell, LayoutDashboard, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "Detección con IA",
    description:
      "Algoritmos avanzados de visión artificial que identifican amenazas en tiempo real con precisión excepcional.",
  },
  {
    icon: Clock,
    title: "Monitoreo 24/7",
    description: "Vigilancia continua sin interrupciones. Tu seguridad nunca descansa, nosotros tampoco.",
  },
  {
    icon: Bell,
    title: "Alertas Inmediatas",
    description: "Notificaciones instantáneas ante cualquier evento sospechoso. Respuesta rápida garantizada.",
  },
  {
    icon: LayoutDashboard,
    title: "Panel Intuitivo",
    description: "Dashboard moderno y fácil de usar. Control total de tu sistema de seguridad desde cualquier lugar.",
  },
  {
    icon: Shield,
    title: "Protección Avanzada",
    description: "Múltiples capas de seguridad que protegen tu espacio con tecnología de última generación.",
  },
  {
    icon: Zap,
    title: "Respuesta Rápida",
    description: "Tiempo de respuesta inferior a 1 segundo. La velocidad marca la diferencia en seguridad.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Características <span className="text-primary">Principales</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Tecnología de vanguardia diseñada para mantener tu espacio seguro en todo momento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
