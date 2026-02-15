import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Centinela <span className="text-primary">AURIS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </a>
            <a href="/#system" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sistema
            </a>
            <a href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonios
            </a>
            <a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Planes
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <Link href="/iniciar-sesion">Iniciar Sesión</Link>
            </Button>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Link href="/registrarse">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
