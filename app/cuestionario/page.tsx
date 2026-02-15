"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

type Answer = {
  blockA?: string
  blockB_cameras?: string
  blockB_locations?: string
  blockC_monitoring?: string
  blockC_integration?: string
  blockD_storage?: string
  blockD_support?: string
  blockE_ai?: string
}

type AurisVersion = "Home" | "PYMES" | "Ejecutivo" | "Industrial" | "Pro"

const questions = [
  {
    id: "blockA",
    title: "¿Dónde planea usar el sistema AURIS?",
    options: [
      { value: "home", label: "🏠 En un hogar o pequeña oficina", icon: "🏠" },
      { value: "business", label: "🏬 En un negocio pequeño o mediano", icon: "🏬" },
      { value: "corporate", label: "🏢 En una oficina corporativa o campus", icon: "🏢" },
      { value: "industrial", label: "🏭 En una planta industrial o centro logístico", icon: "🏭" },
      { value: "government", label: "🏛️ En una institución de gobierno o ciudad inteligente", icon: "🏛️" },
    ],
  },
  {
    id: "blockB_cameras",
    title: "¿Cuántas cámaras planea conectar?",
    options: [
      { value: "1-2", label: "1–2 cámaras" },
      { value: "3-10", label: "3–10 cámaras" },
      { value: "11-50", label: "11–50 cámaras" },
      { value: "51-250", label: "51–250 cámaras" },
      { value: "250+", label: "Más de 250 cámaras" },
    ],
  },
  {
    id: "blockB_locations",
    title: "¿Cuántas ubicaciones físicas desea monitorear?",
    options: [
      { value: "one", label: "Solo una ubicación" },
      { value: "2-5", label: "2–5 ubicaciones" },
      { value: "6-20", label: "6–20 ubicaciones" },
      { value: "20+", label: "Más de 20 ubicaciones" },
    ],
  },
  {
    id: "blockC_monitoring",
    title: "¿Qué tipo de monitoreo busca principalmente?",
    options: [
      { value: "basic", label: "🔍 Seguridad básica (detección de movimiento)" },
      { value: "advanced", label: "🎯 Seguridad avanzada (reconocimiento facial, intrusos, vehículos)" },
      { value: "operations", label: "📊 Análisis de operaciones (eficiencia, flujo de personal)" },
      { value: "both", label: "🔒 Ambos (seguridad + análisis)" },
    ],
  },
  {
    id: "blockC_integration",
    title: "¿Necesita integración con otros sistemas?",
    options: [
      { value: "no", label: "No necesito integraciones" },
      { value: "access", label: "🚪 Sí, control de acceso o alarmas" },
      { value: "api", label: "🔌 Sí, sistemas ERP/CRM mediante API" },
    ],
  },
  {
    id: "blockD_storage",
    title: "¿Por cuánto tiempo desea conservar los videos?",
    options: [
      { value: "7", label: "7 días" },
      { value: "30", label: "30 días" },
      { value: "90", label: "90 días" },
      { value: "unlimited", label: "Ilimitado" },
    ],
  },
  {
    id: "blockD_support",
    title: "¿Qué nivel de soporte necesita?",
    options: [
      { value: "standard", label: "📞 Estándar (horario de oficina)" },
      { value: "priority", label: "⚡ Prioritario (respuesta rápida)" },
      { value: "24/7", label: "🌐 24/7 Dedicado con SLA" },
    ],
  },
  {
    id: "blockE_ai",
    title: "¿Desea IA personalizada entrenada con sus propios procesos?",
    options: [
      { value: "no", label: "No, usar IA estándar" },
      { value: "maybe", label: "Tal vez / No estoy seguro" },
      { value: "yes", label: "✨ Sí, quiero IA personalizada" },
    ],
  },
]

const versionDescriptions = {
  Home: {
    color: "bg-green-500",
    icon: "🟢",
    title: "Centinela AURIS Home",
    description:
      "Ideal para hogares, oficinas pequeñas o departamentos. Ofrece seguridad accesible con detección de movimiento y alertas en tiempo real. Incluye almacenamiento en la nube por 7 días y control desde la app móvil. Perfecto si buscas tranquilidad sin complicaciones.",
  },
  PYMES: {
    color: "bg-orange-500",
    icon: "🟠",
    title: "Centinela AURIS PYMES",
    description:
      "Pensado para pequeños y medianos negocios: tiendas, restaurantes, clínicas. Proporciona detección inteligente estándar, alertas rápidas y almacenamiento de 30 días. Fácil de instalar, sin configuraciones técnicas complejas. Ideal para dueños que quieren seguridad profesional a precio accesible.",
  },
  Ejecutivo: {
    color: "bg-blue-500",
    icon: "🔵",
    title: "Centinela AURIS Ejecutivo",
    description:
      "Diseñado para oficinas corporativas y campus empresariales. Incluye reconocimiento facial de personal, panel de mando ejecutivo y reportes de incidencias. Ofrece soporte prioritario y análisis de datos para mejorar la seguridad organizacional. Perfecto para entornos con alta rotación de personal y necesidad de control.",
  },
  Industrial: {
    color: "bg-purple-500",
    icon: "🟣",
    title: "Centinela AURIS Industrial",
    description:
      "Hecho para plantas, almacenes y centros logísticos. Permite monitoreo de grandes áreas, control de flujo de vehículos y detección perimetral avanzada. Integra IA entrenada para procesos específicos y conexión con sistemas de acceso. Ideal para operaciones 24/7 que requieren máxima precisión.",
  },
  Pro: {
    color: "bg-red-500",
    icon: "🔴",
    title: "Centinela AURIS Pro (Enterprise Máxima)",
    description:
      "La versión definitiva para gobiernos, ciudades inteligentes y corporaciones globales. Ofrece IA personalizada, integración total por API, almacenamiento ilimitado y soporte dedicado 24/7 con SLA garantizado. Incluye análisis predictivo y gestión multi-sitio ilimitada. Diseñado para quienes exigen escalabilidad, personalización y control total.",
  },
}

function calculateRecommendation(answers: Answer): AurisVersion {
  // Home: Hogar + 1-2 cámaras + 7 días + sin integración
  if (
    answers.blockA === "home" &&
    answers.blockB_cameras === "1-2" &&
    answers.blockD_storage === "7" &&
    answers.blockC_integration === "no"
  ) {
    return "Home"
  }

  // PYMES: Negocio Pequeño + ≤10 cámaras + 30 días + sin IA personalizada
  if (
    answers.blockA === "business" &&
    (answers.blockB_cameras === "3-10" || answers.blockB_cameras === "1-2") &&
    answers.blockE_ai !== "yes"
  ) {
    return "PYMES"
  }

  // Pro: Gobierno o +250 cámaras + API + IA personalizada + SLA 24/7
  if (
    answers.blockA === "government" ||
    answers.blockB_cameras === "250+" ||
    (answers.blockC_integration === "api" && answers.blockE_ai === "yes" && answers.blockD_support === "24/7")
  ) {
    return "Pro"
  }

  // Industrial: Industria o Logística + >50 cámaras + IA entrenada o multi-sitio
  if (
    answers.blockA === "industrial" ||
    answers.blockB_cameras === "51-250" ||
    answers.blockB_cameras === "250+" ||
    answers.blockE_ai === "yes" ||
    answers.blockB_locations === "6-20" ||
    answers.blockB_locations === "20+"
  ) {
    return "Industrial"
  }

  // Ejecutivo: Oficina Corporativa + 11-50 cámaras + análisis avanzado + soporte prioritario
  if (
    answers.blockA === "corporate" ||
    answers.blockB_cameras === "11-50" ||
    answers.blockC_monitoring === "advanced" ||
    answers.blockC_monitoring === "both" ||
    answers.blockD_support === "priority"
  ) {
    return "Ejecutivo"
  }

  // Default fallback
  return "PYMES"
}

export default function CuestionarioPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answer>({})
  const [showResult, setShowResult] = useState(false)
  const [recommendation, setRecommendation] = useState<AurisVersion | null>(null)

  const progress = ((currentStep + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      const result = calculateRecommendation(answers)
      setRecommendation(result)
      setShowResult(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResult(false)
    setRecommendation(null)
  }

  const currentQuestion = questions[currentStep]
  const currentAnswer = answers[currentQuestion?.id as keyof Answer]

  if (showResult && recommendation) {
    const versionInfo = versionDescriptions[recommendation]
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">El Centinela ideal para ti es:</h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-5xl">{versionInfo.icon}</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-primary">{versionInfo.title}</h2>
              </div>
            </div>

            <Card className="p-8 lg:p-12 border-2 border-primary/20 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{versionInfo.description}</p>

              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <p className="text-sm text-muted-foreground italic">
                  "Gracias por responder. Nuestro sistema ha analizado tus respuestas y recomienda la versión{" "}
                  <span className="font-semibold text-foreground">{versionInfo.title}</span>. Un especialista puede
                  contactarte para mostrarte una demo o enviarte una cotización personalizada."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  🔍 Ver detalles del plan
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-primary/50 hover:bg-primary/10 bg-transparent"
                >
                  💬 Solicitar cotización
                </Button>
                <Button size="lg" variant="outline" className="flex-1 bg-transparent" onClick={handleRestart}>
                  🔄 Reintentar
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              💡 Descubre cuál Centinela AURIS está hecho para ti
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Responde unas cuantas preguntas rápidas y encuentra la versión de Centinela AURIS que mejor se adapta a
              tus necesidades de seguridad e inteligencia artificial.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Pregunta {currentStep + 1} de {questions.length}
              </span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="p-8 lg:p-12 border-2 border-border shadow-xl animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8 text-balance">
              {currentQuestion.title}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-4 lg:p-5 rounded-lg border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
                    currentAnswer === option.value
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  }`}
                >
                  <span className="text-base lg:text-lg font-medium text-foreground">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Atrás
              </Button>
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!currentAnswer}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {currentStep === questions.length - 1 ? "Ver resultado" : "Siguiente"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
