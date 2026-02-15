import { Button } from "@/components/ui/button"
import { Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Gradient orbs - Police light effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/50 rounded-full blur-2xl animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/50 rounded-full blur-2xl animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-4">
            Tecnología de Visión Artificial
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Centinela AURIS: <span className="text-primary">Protección Inteligente</span> en Tiempo Real
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Monitorea, detecta y actúa con tecnología de visión artificial avanzada. Seguridad que nunca duerme.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/cuestionario">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 text-lg px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Encuentra tu Centinela ideal
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted text-lg px-8 group bg-transparent"
            >
              <Play className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
              Ver demostración
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Precisión</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-secondary">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoreo</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">&lt;1s</div>
              <div className="text-sm text-muted-foreground">Respuesta</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
