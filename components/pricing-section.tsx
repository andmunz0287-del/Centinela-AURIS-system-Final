import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Básico",
    price: "$299",
    period: "/mes",
    description: "Perfecto para pequeñas empresas",
    features: [
      "Hasta 4 cámaras",
      "Detección con IA básica",
      "Almacenamiento 7 días",
      "Alertas por email",
      "Soporte por email",
    ],
  },
  {
    name: "Profesional",
    price: "$599",
    period: "/mes",
    description: "Ideal para empresas en crecimiento",
    features: [
      "Hasta 16 cámaras",
      "Detección con IA avanzada",
      "Almacenamiento 30 días",
      "Alertas multi-canal",
      "Soporte prioritario 24/7",
      "Análisis avanzado",
      "API personalizada",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Para grandes organizaciones",
    features: [
      "Cámaras ilimitadas",
      "IA personalizada",
      "Almacenamiento ilimitado",
      "Alertas personalizadas",
      "Soporte dedicado 24/7",
      "Análisis predictivo",
      "Integración completa",
      "SLA garantizado",
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Planes que se adaptan a <span className="text-primary">tu negocio</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Elige el plan perfecto para tus necesidades de seguridad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 relative ${
                plan.popular ? "border-primary shadow-xl shadow-primary/20 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Más Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Solicitar demostración
                </Button>

                <div className="space-y-3 pt-6 border-t border-border">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
