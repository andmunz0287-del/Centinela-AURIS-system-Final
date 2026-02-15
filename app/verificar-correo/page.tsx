"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { CheckCircle2, XCircle, Loader2, Mail, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
      setStatus("error")
      return
    }

    setUserEmail(email)

    // Simulate verification process
    const timer = setTimeout(() => {
      // Check localStorage for user with this token
      const users = JSON.parse(localStorage.getItem("centinela_users") || "[]")
      const userIndex = users.findIndex(
        (u: { email: string; verificationToken: string }) => u.email === email && u.verificationToken === token,
      )

      if (userIndex !== -1) {
        // Mark user as verified
        users[userIndex].verified = true
        users[userIndex].verifiedAt = new Date().toISOString()
        localStorage.setItem("centinela_users", JSON.stringify(users))
        setStatus("success")
      } else {
        setStatus("expired")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/50 rounded-full blur-2xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-2xl animate-pulse-glow" />

      <Navigation />

      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl text-center">
            {status === "loading" && (
              <>
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Verificando tu correo...</h1>
                <p className="text-muted-foreground">
                  Por favor espera mientras confirmamos tu dirección de correo electrónico.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">¡Correo verificado!</h1>
                <p className="text-muted-foreground mb-6">
                  Tu correo electrónico <span className="text-primary font-medium">{userEmail}</span> ha sido verificado
                  exitosamente. Ahora puedes iniciar sesión en tu cuenta.
                </p>

                <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Tu cuenta está lista
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Acceso completo al panel de control
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Configuración de alertas personalizadas
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      Soporte prioritario 24/7
                    </li>
                  </ul>
                </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/iniciar-sesion">
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Enlace inválido</h1>
                <p className="text-muted-foreground mb-6">
                  El enlace de verificación es inválido o está incompleto. Por favor, verifica que hayas copiado
                  correctamente el enlace del correo electrónico.
                </p>
                <div className="flex flex-col gap-3">
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/registrarse">Registrarse de nuevo</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border/50 bg-transparent">
                    <Link href="/soporte">Contactar soporte</Link>
                  </Button>
                </div>
              </>
            )}

            {status === "expired" && (
              <>
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Enlace expirado</h1>
                <p className="text-muted-foreground mb-6">
                  El enlace de verificación ha expirado o ya fue utilizado. Los enlaces de verificación son válidos por
                  24 horas.
                </p>
                <div className="flex flex-col gap-3">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Reenviar correo de verificación
                  </Button>
                  <Button asChild variant="outline" className="border-border/50 bg-transparent">
                    <Link href="/iniciar-sesion">Ir a Iniciar Sesión</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
