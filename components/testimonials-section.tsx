import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Mendoza",
    role: "Director de Seguridad",
    company: "TechCorp Industries",
    content:
      "Centinela AURIS ha transformado completamente nuestra seguridad. La detección con IA es increíblemente precisa y las alertas instantáneas nos dan tranquilidad total.",
    rating: 5,
    image: "/professional-man-portrait.png",
  },
  {
    name: "María González",
    role: "Gerente de Operaciones",
    company: "Retail Solutions",
    content:
      "La interfaz es intuitiva y el sistema funciona perfectamente. Hemos reducido incidentes en un 85% desde que implementamos Centinela AURIS.",
    rating: 5,
    image: "/professional-woman-portrait.png",
  },
  {
    name: "Roberto Silva",
    role: "CEO",
    company: "Innovatech",
    content:
      "El mejor sistema de seguridad que hemos probado. La tecnología de visión artificial es impresionante y el soporte técnico es excepcional.",
    rating: 5,
    image: "/business-executive-portrait.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Lo que dicen nuestros <span className="text-primary">clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Empresas líderes confían en Centinela AURIS para su seguridad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
