"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Bell,
  AlertCircle,
  Calendar,
  CreditCard,
  Home,
  Smartphone,
  X,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FormErrors {
  [key: string]: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [emailExists, setEmailExists] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  const [formData, setFormData] = useState({
    // Paso 1: Información Personal
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    emailConfirm: "",
    phone: "",
    phoneSecondary: "",
    birthDate: "",
    gender: "",
    documentType: "",
    documentNumber: "",
    nationality: "",

    // Paso 2: Información de Seguridad
    password: "",
    confirmPassword: "",
    securityQuestion1: "",
    securityAnswer1: "",
    securityQuestion2: "",
    securityAnswer2: "",
    twoFactorMethod: "",
    recoveryEmail: "",

    // Paso 3: Información de Ubicación/Empresa
    accountType: "personal",
    companyName: "",
    companyRFC: "",
    companyType: "",
    employeeCount: "",
    industry: "",
    jobTitle: "",
    department: "",
    address: "",
    addressNumber: "",
    addressInterior: "",
    neighborhood: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    propertyType: "",
    propertySize: "",
    existingSecuritySystem: "",

    // Paso 4: Preferencias y Servicios
    preferredPlan: "",
    installationDate: "",
    preferredContactTime: "",
    preferredContactMethod: "",
    howDidYouHear: "",
    referralCode: "",
    additionalNotes: "",
    specialRequirements: "",

    // Paso 5: Términos y Confirmación
    acceptTerms: false,
    acceptPrivacy: false,
    acceptDataProcessing: false,
    acceptMarketing: false,
    acceptNotifications: true,
    acceptSMS: false,
    acceptWhatsApp: true,
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  })

  const totalSteps = 5

  // Password strength checker
  useEffect(() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }, [formData.password])

  // Username availability check
  useEffect(() => {
    if (formData.username.length >= 3) {
      setCheckingUsername(true)
      const timer = setTimeout(() => {
        // Simulated check - in production this would be an API call
        const existingUsers = JSON.parse(localStorage.getItem("centinela_users") || "[]")
        const exists = existingUsers.some((u: { username: string }) => u.username === formData.username)
        setUsernameAvailable(!exists)
        setCheckingUsername(false)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setUsernameAvailable(null)
    }
  }, [formData.username])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {}

    if (currentStep === 1) {
      if (!formData.username || formData.username.length < 3) {
        newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
      }
      if (usernameAvailable === false) {
        newErrors.username = "Este nombre de usuario ya está en uso"
      }
      if (!formData.firstName) newErrors.firstName = "El nombre es requerido"
      if (!formData.lastName) newErrors.lastName = "Los apellidos son requeridos"
      if (!formData.email) {
        newErrors.email = "El correo electrónico es requerido"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Ingresa un correo electrónico válido"
      }
      if (formData.email !== formData.emailConfirm) {
        newErrors.emailConfirm = "Los correos electrónicos no coinciden"
      }
      if (!formData.phone) {
        newErrors.phone = "El teléfono es requerido"
      } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
        newErrors.phone = "Ingresa un número de teléfono válido"
      }
    }

    if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida"
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      } else if (passwordStrength < 4) {
        newErrors.password = "La contraseña es muy débil"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
      if (!formData.securityQuestion1) newErrors.securityQuestion1 = "Selecciona una pregunta de seguridad"
      if (!formData.securityAnswer1) newErrors.securityAnswer1 = "La respuesta es requerida"
    }

    if (currentStep === 3) {
      if (!formData.address) newErrors.address = "La dirección es requerida"
      if (!formData.city) newErrors.city = "La ciudad es requerida"
      if (!formData.state) newErrors.state = "El estado es requerido"
      if (!formData.postalCode) newErrors.postalCode = "El código postal es requerido"
      if (!formData.country) newErrors.country = "El país es requerido"
      if (formData.accountType === "business" && !formData.companyName) {
        newErrors.companyName = "El nombre de la empresa es requerido"
      }
    }

    if (currentStep === 5) {
      if (!formData.acceptTerms) newErrors.acceptTerms = "Debes aceptar los términos y condiciones"
      if (!formData.acceptPrivacy) newErrors.acceptPrivacy = "Debes aceptar la política de privacidad"
      if (!formData.acceptDataProcessing) newErrors.acceptDataProcessing = "Debes autorizar el procesamiento de datos"
      if (!formData.emergencyContactName) newErrors.emergencyContactName = "El contacto de emergencia es requerido"
      if (!formData.emergencyContactPhone) newErrors.emergencyContactPhone = "El teléfono de emergencia es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user in localStorage for demo purposes
        const existingUsers = JSON.parse(localStorage.getItem("centinela_users") || "[]")
        const newUser = {
          id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password, // In production, this would be hashed
          verified: false,
          verificationToken: data.verificationToken,
          createdAt: new Date().toISOString(),
          ...formData,
        }
        existingUsers.push(newUser)
        localStorage.setItem("centinela_users", JSON.stringify(existingUsers))

        setIsSuccess(true)
      } else {
        setErrors({ submit: data.error || "Error al procesar el registro" })
      }
    } catch (error) {
      console.error("Error al registrar:", error)
      setErrors({ submit: "Error de conexión. Intenta nuevamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all shrink-0 ${
              s === step
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                : s < step
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
          {s < totalSteps && (
            <div className={`w-8 md:w-16 h-1 mx-1 rounded ${s < step ? "bg-green-500" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  )

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    if (passwordStrength <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Muy débil"
    if (passwordStrength <= 3) return "Débil"
    if (passwordStrength <= 4) return "Buena"
    return "Excelente"
  }

  const stepTitles = [
    "Información Personal",
    "Seguridad de la Cuenta",
    "Ubicación y Propiedad",
    "Preferencias de Servicio",
    "Confirmación Final",
  ]

  const stepDescriptions = [
    "Cuéntanos sobre ti para personalizar tu experiencia",
    "Protege tu cuenta con credenciales seguras",
    "Información sobre tu ubicación y propiedad a proteger",
    "Personaliza tu servicio de seguridad",
    "Revisa y confirma tu registro",
  ]

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/50 rounded-full blur-2xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-2xl animate-pulse-glow" />
        <Navigation />

        <div className="flex items-center justify-center min-h-screen pt-20 px-4">
          <div className="relative z-10 w-full max-w-2xl">
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
              {/* Success Animation */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Mail className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">¡Registro Exitoso!</h1>
                <p className="text-xl text-primary">Bienvenido a Centinela AURIS, {formData.firstName}</p>
              </div>

              {/* Email Verification Notice */}
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">Verifica tu correo electrónico</h3>
                    <p className="text-muted-foreground mb-3">
                      Hemos enviado un correo de verificación a{" "}
                      <span className="text-primary font-medium">{formData.email}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace de
                      verificación para activar tu cuenta completamente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Resumen de tu cuenta
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Usuario:</span>
                    <span className="text-foreground ml-2 font-medium">@{formData.username}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="text-foreground ml-2">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Correo:</span>
                    <span className="text-foreground ml-2">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="text-foreground ml-2">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="text-primary ml-2 font-medium">
                      {formData.preferredPlan ? formData.preferredPlan.replace(/_/g, " ").toUpperCase() : "Por definir"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ubicación:</span>
                    <span className="text-foreground ml-2">
                      {formData.city}, {formData.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Próximos pasos
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Verifica tu correo electrónico",
                      description: "Haz clic en el enlace que enviamos a tu correo",
                      icon: Mail,
                      status: "pending",
                    },
                    {
                      step: 2,
                      title: "Inicia sesión en tu cuenta",
                      description: "Accede al panel de control de Centinela AURIS",
                      icon: Lock,
                      status: "locked",
                    },
                    {
                      step: 3,
                      title: "Completa tu perfil",
                      description: "Agrega información adicional y preferencias",
                      icon: User,
                      status: "locked",
                    },
                    {
                      step: 4,
                      title: "Agenda tu instalación",
                      description: "Un especialista te contactará para coordinar",
                      icon: Calendar,
                      status: "locked",
                    },
                    {
                      step: 5,
                      title: "Activa tu sistema",
                      description: "Comienza a disfrutar de la seguridad AURIS",
                      icon: Shield,
                      status: "locked",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          item.status === "pending" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status === "pending" ? (
                          <item.icon className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{item.step}</span>
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${item.status === "pending" ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Información importante</p>
                    <p className="text-sm text-muted-foreground">
                      El enlace de verificación expira en 24 horas. Si no verificas tu correo, deberás solicitar un
                      nuevo enlace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/iniciar-sesion">Ir a Iniciar Sesión</Link>
                </Button>
                <Button variant="outline" className="flex-1 border-border/50 bg-transparent">
                  Reenviar correo de verificación
                </Button>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t border-border/30 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Necesitas ayuda?{" "}
                  <Link href="/soporte" className="text-primary hover:underline">
                    Contacta a soporte
                  </Link>{" "}
                  o llama al <span className="text-foreground">+52 55 1234 5678</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/50 rounded-full blur-2xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-2xl animate-pulse-glow" />

      <Navigation />

      <div className="flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
        <div className="relative z-10 w-full max-w-3xl">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground text-center">Únete a Centinela AURIS</h1>
              <p className="text-primary font-medium mt-1">
                Paso {step} de {totalSteps}: {stepTitles[step - 1]}
              </p>
              <p className="text-muted-foreground text-sm text-center mt-1">{stepDescriptions[step - 1]}</p>
            </div>

            {renderStepIndicator()}

            {/* Global Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Información Personal */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Nombre de Usuario <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        id="username"
                        placeholder="tu_usuario"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value.toLowerCase().replace(/\s/g, "_"))
                        }
                        className={`pl-8 pr-10 bg-background/50 border-border/50 ${errors.username ? "border-red-500" : ""}`}
                      />
                      {formData.username.length >= 3 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {checkingUsername ? (
                            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                          ) : usernameAvailable ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                    {usernameAvailable && formData.username.length >= 3 && (
                      <p className="text-green-500 text-xs">Nombre de usuario disponible</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Tu nombre"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`pl-10 bg-background/50 border-border/50 ${errors.firstName ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Apellidos <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="lastName"
                          placeholder="Tus apellidos"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={`pl-10 bg-background/50 border-border/50 ${errors.lastName ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 bg-background/50 border-border/50 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailConfirm">
                      Confirmar Correo <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="emailConfirm"
                        type="email"
                        placeholder="Repite tu correo"
                        value={formData.emailConfirm}
                        onChange={(e) => handleInputChange("emailConfirm", e.target.value)}
                        className={`pl-10 bg-background/50 border-border/50 ${errors.emailConfirm ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.emailConfirm && <p className="text-red-500 text-xs">{errors.emailConfirm}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Teléfono Principal <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+52 55 1234 5678"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`pl-10 bg-background/50 border-border/50 ${errors.phone ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneSecondary">Teléfono Secundario</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="phoneSecondary"
                          type="tel"
                          placeholder="+52 55 8765 4321"
                          value={formData.phoneSecondary}
                          onChange={(e) => handleInputChange("phoneSecondary", e.target.value)}
                          className="pl-10 bg-background/50 border-border/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Género</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Femenino</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                          <SelectItem value="prefer-not">Prefiero no decir</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nacionalidad</Label>
                      <Select
                        value={formData.nationality}
                        onValueChange={(value) => handleInputChange("nationality", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mexican">Mexicana</SelectItem>
                          <SelectItem value="american">Estadounidense</SelectItem>
                          <SelectItem value="spanish">Española</SelectItem>
                          <SelectItem value="other">Otra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Tipo de Documento</Label>
                      <Select
                        value={formData.documentType}
                        onValueChange={(value) => handleInputChange("documentType", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ine">INE/IFE</SelectItem>
                          <SelectItem value="passport">Pasaporte</SelectItem>
                          <SelectItem value="license">Licencia de conducir</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Número de Documento</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="documentNumber"
                          placeholder="Número de identificación"
                          value={formData.documentNumber}
                          onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                          className="pl-10 bg-background/50 border-border/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Seguridad de la Cuenta */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Contraseña <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 bg-background/50 border-border/50 ${errors.password ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded ${i <= passwordStrength ? getPasswordStrengthColor() : "bg-muted"}`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${getPasswordStrengthColor().replace("bg-", "text-")}`}>
                          Fortaleza: {getPasswordStrengthText()}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground space-y-1 mt-2">
                      <p className="font-medium">La contraseña debe contener:</p>
                      <ul className="grid grid-cols-2 gap-1">
                        <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                          {formData.password.length >= 8 ? "✓" : "○"} Mínimo 8 caracteres
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                          {/[A-Z]/.test(formData.password) ? "✓" : "○"} Una mayúscula
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}>
                          {/[a-z]/.test(formData.password) ? "✓" : "○"} Una minúscula
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>
                          {/[0-9]/.test(formData.password) ? "✓" : "○"} Un número
                        </li>
                        <li className={/[^a-zA-Z0-9]/.test(formData.password) ? "text-green-500" : ""}>
                          {/[^a-zA-Z0-9]/.test(formData.password) ? "✓" : "○"} Un carácter especial
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Contraseña <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 bg-background/50 border-border/50 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-green-500 text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" /> Las contraseñas coinciden
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityQuestion1">
                      Pregunta de Seguridad 1 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.securityQuestion1}
                      onValueChange={(value) => handleInputChange("securityQuestion1", value)}
                    >
                      <SelectTrigger
                        className={`bg-background/50 border-border/50 ${errors.securityQuestion1 ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Selecciona una pregunta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pet">¿Cuál es el nombre de tu primera mascota?</SelectItem>
                        <SelectItem value="city">¿En qué ciudad naciste?</SelectItem>
                        <SelectItem value="school">¿Cuál fue el nombre de tu primera escuela?</SelectItem>
                        <SelectItem value="friend">¿Cuál es el nombre de tu mejor amigo de la infancia?</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.securityQuestion1 && <p className="text-red-500 text-xs">{errors.securityQuestion1}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityAnswer1">
                      Respuesta <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="securityAnswer1"
                      placeholder="Tu respuesta"
                      value={formData.securityAnswer1}
                      onChange={(e) => handleInputChange("securityAnswer1", e.target.value)}
                      className={`bg-background/50 border-border/50 ${errors.securityAnswer1 ? "border-red-500" : ""}`}
                    />
                    {errors.securityAnswer1 && <p className="text-red-500 text-xs">{errors.securityAnswer1}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityQuestion2">Pregunta de Seguridad 2</Label>
                    <Select
                      value={formData.securityQuestion2}
                      onValueChange={(value) => handleInputChange("securityQuestion2", value)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Selecciona una pregunta (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mother">¿Cuál es el apellido de soltera de tu madre?</SelectItem>
                        <SelectItem value="car">¿Cuál fue tu primer automóvil?</SelectItem>
                        <SelectItem value="teacher">¿Cuál es el nombre de tu maestro favorito?</SelectItem>
                        <SelectItem value="street">¿En qué calle creciste?</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.securityQuestion2 && (
                    <div className="space-y-2">
                      <Label htmlFor="securityAnswer2">Respuesta</Label>
                      <Input
                        id="securityAnswer2"
                        placeholder="Tu respuesta"
                        value={formData.securityAnswer2}
                        onChange={(e) => handleInputChange("securityAnswer2", e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="twoFactorMethod">Método de Autenticación de Dos Factores</Label>
                    <Select
                      value={formData.twoFactorMethod}
                      onValueChange={(value) => handleInputChange("twoFactorMethod", value)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Selecciona un método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS al teléfono</SelectItem>
                        <SelectItem value="email">Correo electrónico</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="authenticator">App de autenticación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recoveryEmail">Correo de Recuperación</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="recoveryEmail"
                        type="email"
                        placeholder="correo.alternativo@email.com"
                        value={formData.recoveryEmail}
                        onChange={(e) => handleInputChange("recoveryEmail", e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Usado para recuperar tu cuenta si pierdes acceso al correo principal
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 mt-4">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Tu seguridad es nuestra prioridad
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Tus datos están encriptados con tecnología AES-256</li>
                      <li>• Autenticación de dos factores disponible</li>
                      <li>• Monitoreo de actividad sospechosa 24/7</li>
                      <li>• Nunca compartimos tu información con terceros</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Ubicación y Propiedad */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>
                      Tipo de Cuenta <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.accountType}
                      onValueChange={(value) => handleInputChange("accountType", value)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.accountType === "personal" ? "border-primary bg-primary/10" : "border-border/50 bg-background/50"}`}
                      >
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal" className="cursor-pointer flex items-center gap-2">
                          <Home className="w-5 h-5" />
                          Personal/Residencial
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.accountType === "business" ? "border-primary bg-primary/10" : "border-border/50 bg-background/50"}`}
                      >
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="cursor-pointer flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Empresa/Comercial
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.accountType === "business" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">
                            Nombre de la Empresa <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="companyName"
                              placeholder="Mi Empresa S.A. de C.V."
                              value={formData.companyName}
                              onChange={(e) => handleInputChange("companyName", e.target.value)}
                              className={`pl-10 bg-background/50 border-border/50 ${errors.companyName ? "border-red-500" : ""}`}
                            />
                          </div>
                          {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyRFC">RFC</Label>
                          <Input
                            id="companyRFC"
                            placeholder="XAXX010101000"
                            value={formData.companyRFC}
                            onChange={(e) => handleInputChange("companyRFC", e.target.value.toUpperCase())}
                            className="bg-background/50 border-border/50"
                            maxLength={13}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industria</Label>
                          <Select
                            value={formData.industry}
                            onValueChange={(value) => handleInputChange("industry", value)}
                          >
                            <SelectTrigger className="bg-background/50 border-border/50">
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retail">Retail/Comercio</SelectItem>
                              <SelectItem value="manufacturing">Manufactura</SelectItem>
                              <SelectItem value="technology">Tecnología</SelectItem>
                              <SelectItem value="healthcare">Salud</SelectItem>
                              <SelectItem value="education">Educación</SelectItem>
                              <SelectItem value="hospitality">Hospitalidad</SelectItem>
                              <SelectItem value="finance">Finanzas</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employeeCount">Empleados</Label>
                          <Select
                            value={formData.employeeCount}
                            onValueChange={(value) => handleInputChange("employeeCount", value)}
                          >
                            <SelectTrigger className="bg-background/50 border-border/50">
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-500">201-500</SelectItem>
                              <SelectItem value="500+">Más de 500</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Tu Cargo</Label>
                          <Input
                            id="jobTitle"
                            placeholder="Director de Seguridad"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="border-t border-border/30 pt-4 mt-4">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Dirección de la Propiedad a Proteger
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">
                        Calle <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        placeholder="Av. Insurgentes Sur"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className={`bg-background/50 border-border/50 ${errors.address ? "border-red-500" : ""}`}
                      />
                      {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressNumber">Número</Label>
                      <Input
                        id="addressNumber"
                        placeholder="1234"
                        value={formData.addressNumber}
                        onChange={(e) => handleInputChange("addressNumber", e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressInterior">Interior/Depto</Label>
                      <Input
                        id="addressInterior"
                        placeholder="Piso 5, Depto 501"
                        value={formData.addressInterior}
                        onChange={(e) => handleInputChange("addressInterior", e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Colonia</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Del Valle"
                        value={formData.neighborhood}
                        onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        Ciudad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        placeholder="Ciudad de México"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={`bg-background/50 border-border/50 ${errors.city ? "border-red-500" : ""}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">
                        Estado <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        placeholder="CDMX"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className={`bg-background/50 border-border/50 ${errors.state ? "border-red-500" : ""}`}
                      />
                      {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        C.P. <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        placeholder="03100"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className={`bg-background/50 border-border/50 ${errors.postalCode ? "border-red-500" : ""}`}
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        País <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger
                          className={`bg-background/50 border-border/50 ${errors.country ? "border-red-500" : ""}`}
                        >
                          <SelectValue placeholder="País" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mexico">México</SelectItem>
                          <SelectItem value="usa">Estados Unidos</SelectItem>
                          <SelectItem value="canada">Canadá</SelectItem>
                          <SelectItem value="spain">España</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Tipo de Propiedad</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) => handleInputChange("propertyType", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">Casa</SelectItem>
                          <SelectItem value="apartment">Departamento</SelectItem>
                          <SelectItem value="condo">Condominio</SelectItem>
                          <SelectItem value="office">Oficina</SelectItem>
                          <SelectItem value="store">Local comercial</SelectItem>
                          <SelectItem value="warehouse">Bodega</SelectItem>
                          <SelectItem value="factory">Fábrica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertySize">Tamaño Aproximado (m²)</Label>
                      <Select
                        value={formData.propertySize}
                        onValueChange={(value) => handleInputChange("propertySize", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Menos de 100 m²</SelectItem>
                          <SelectItem value="medium">100-300 m²</SelectItem>
                          <SelectItem value="large">300-1000 m²</SelectItem>
                          <SelectItem value="xlarge">Más de 1000 m²</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existingSecuritySystem">Sistema de Seguridad Actual</Label>
                      <Select
                        value={formData.existingSecuritySystem}
                        onValueChange={(value) => handleInputChange("existingSecuritySystem", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                          <SelectItem value="cameras">Solo cámaras</SelectItem>
                          <SelectItem value="alarm">Sistema de alarma</SelectItem>
                          <SelectItem value="monitoring">Monitoreo 24/7</SelectItem>
                          <SelectItem value="guards">Guardias de seguridad</SelectItem>
                          <SelectItem value="complete">Sistema completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Preferencias de Servicio */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredPlan">Plan de Interés</Label>
                    <Select
                      value={formData.preferredPlan}
                      onValueChange={(value) => handleInputChange("preferredPlan", value)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Selecciona un plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">AURIS Home - $2,499/mes (Residencial)</SelectItem>
                        <SelectItem value="pymes">AURIS PYMES - $4,999/mes (Pequeños negocios)</SelectItem>
                        <SelectItem value="executive">AURIS Ejecutivo - $7,999/mes (Corporativo)</SelectItem>
                        <SelectItem value="industrial">
                          AURIS Industrial - $14,999/mes (Grandes instalaciones)
                        </SelectItem>
                        <SelectItem value="pro">AURIS Pro - Personalizado (Solución a medida)</SelectItem>
                        <SelectItem value="undecided">Necesito asesoría para decidir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="installationDate">Fecha Preferida de Instalación</Label>
                      <Input
                        id="installationDate"
                        type="date"
                        value={formData.installationDate}
                        onChange={(e) => handleInputChange("installationDate", e.target.value)}
                        className="bg-background/50 border-border/50"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredContactTime">Horario de Contacto Preferido</Label>
                      <Select
                        value={formData.preferredContactTime}
                        onValueChange={(value) => handleInputChange("preferredContactTime", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona un horario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Mañana (9:00 - 12:00)</SelectItem>
                          <SelectItem value="afternoon">Tarde (12:00 - 18:00)</SelectItem>
                          <SelectItem value="evening">Noche (18:00 - 21:00)</SelectItem>
                          <SelectItem value="anytime">Cualquier horario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredContactMethod">Método de Contacto Preferido</Label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) => handleInputChange("preferredContactMethod", value)}
                    >
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Selecciona un método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Llamada telefónica</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Correo electrónico</SelectItem>
                        <SelectItem value="videocall">Videollamada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="howDidYouHear">¿Cómo nos conociste?</Label>
                      <Select
                        value={formData.howDidYouHear}
                        onValueChange={(value) => handleInputChange("howDidYouHear", value)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Búsqueda en Google</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="referral">Recomendación de un conocido</SelectItem>
                          <SelectItem value="advertising">Publicidad</SelectItem>
                          <SelectItem value="event">Evento/Expo</SelectItem>
                          <SelectItem value="news">Noticias/Prensa</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referralCode">Código de Referido</Label>
                      <Input
                        id="referralCode"
                        placeholder="AURIS2024"
                        value={formData.referralCode}
                        onChange={(e) => handleInputChange("referralCode", e.target.value.toUpperCase())}
                        className="bg-background/50 border-border/50"
                      />
                      <p className="text-xs text-muted-foreground">Si tienes un código de descuento, ingrésalo aquí</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Requerimientos Especiales</Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="¿Tienes necesidades específicas de seguridad? (ej: mascotas, horarios especiales, zonas críticas)"
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
                      className="bg-background/50 border-border/50 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Notas Adicionales</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="¿Hay algo más que debamos saber sobre tu propiedad o tus expectativas?"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      className="bg-background/50 border-border/50 min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Confirmación Final */}
              {step === 5 && (
                <div className="space-y-4">
                  {/* Emergency Contact */}
                  <div className="bg-muted/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Contacto de Emergencia <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      En caso de una emergencia, contactaremos a esta persona si no podemos comunicarnos contigo.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">Nombre Completo</Label>
                        <Input
                          id="emergencyContactName"
                          placeholder="Nombre del contacto"
                          value={formData.emergencyContactName}
                          onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                          className={`bg-background/50 border-border/50 ${errors.emergencyContactName ? "border-red-500" : ""}`}
                        />
                        {errors.emergencyContactName && (
                          <p className="text-red-500 text-xs">{errors.emergencyContactName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactPhone">Teléfono</Label>
                        <Input
                          id="emergencyContactPhone"
                          type="tel"
                          placeholder="+52 55 1234 5678"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                          className={`bg-background/50 border-border/50 ${errors.emergencyContactPhone ? "border-red-500" : ""}`}
                        />
                        {errors.emergencyContactPhone && (
                          <p className="text-red-500 text-xs">{errors.emergencyContactPhone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactRelation">Relación</Label>
                        <Select
                          value={formData.emergencyContactRelation}
                          onValueChange={(value) => handleInputChange("emergencyContactRelation", value)}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Cónyuge</SelectItem>
                            <SelectItem value="parent">Padre/Madre</SelectItem>
                            <SelectItem value="sibling">Hermano/a</SelectItem>
                            <SelectItem value="child">Hijo/a</SelectItem>
                            <SelectItem value="friend">Amigo/a</SelectItem>
                            <SelectItem value="colleague">Colega</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-muted/30 rounded-xl p-4 space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Términos, Condiciones y Autorizaciones
                    </h4>

                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg ${errors.acceptTerms ? "bg-red-500/10 border border-red-500/30" : ""}`}
                    >
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptTerms" className="text-sm text-muted-foreground cursor-pointer">
                        <span className="text-red-500">*</span> Acepto los{" "}
                        <Link href="/terminos" className="text-primary hover:underline">
                          Términos y Condiciones
                        </Link>{" "}
                        del servicio de Centinela AURIS, incluyendo el contrato de prestación de servicios de seguridad.
                      </Label>
                    </div>

                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg ${errors.acceptPrivacy ? "bg-red-500/10 border border-red-500/30" : ""}`}
                    >
                      <Checkbox
                        id="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onCheckedChange={(checked) => handleInputChange("acceptPrivacy", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptPrivacy" className="text-sm text-muted-foreground cursor-pointer">
                        <span className="text-red-500">*</span> He leído y acepto la{" "}
                        <Link href="/privacidad" className="text-primary hover:underline">
                          Política de Privacidad
                        </Link>{" "}
                        y entiendo cómo se utilizarán mis datos personales.
                      </Label>
                    </div>

                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg ${errors.acceptDataProcessing ? "bg-red-500/10 border border-red-500/30" : ""}`}
                    >
                      <Checkbox
                        id="acceptDataProcessing"
                        checked={formData.acceptDataProcessing}
                        onCheckedChange={(checked) => handleInputChange("acceptDataProcessing", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptDataProcessing" className="text-sm text-muted-foreground cursor-pointer">
                        <span className="text-red-500">*</span> Autorizo a Centinela AURIS a procesar mis datos
                        personales, incluyendo grabaciones de audio y video de mi propiedad, para fines de seguridad y
                        monitoreo.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg">
                      <Checkbox
                        id="acceptNotifications"
                        checked={formData.acceptNotifications}
                        onCheckedChange={(checked) => handleInputChange("acceptNotifications", checked as boolean)}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="acceptNotifications"
                        className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1"
                      >
                        <Bell className="w-3 h-3" />
                        Deseo recibir notificaciones importantes sobre mi cuenta, alertas de seguridad y actualizaciones
                        del sistema.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg">
                      <Checkbox
                        id="acceptSMS"
                        checked={formData.acceptSMS}
                        onCheckedChange={(checked) => handleInputChange("acceptSMS", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptSMS" className="text-sm text-muted-foreground cursor-pointer">
                        Acepto recibir mensajes SMS con alertas de seguridad y verificación de cuenta.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg">
                      <Checkbox
                        id="acceptWhatsApp"
                        checked={formData.acceptWhatsApp}
                        onCheckedChange={(checked) => handleInputChange("acceptWhatsApp", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptWhatsApp" className="text-sm text-muted-foreground cursor-pointer">
                        Acepto recibir comunicaciones vía WhatsApp (alertas, soporte y actualizaciones).
                      </Label>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg">
                      <Checkbox
                        id="acceptMarketing"
                        checked={formData.acceptMarketing}
                        onCheckedChange={(checked) => handleInputChange("acceptMarketing", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="acceptMarketing" className="text-sm text-muted-foreground cursor-pointer">
                        Me gustaría recibir ofertas especiales, promociones, novedades y contenido educativo sobre
                        seguridad de Centinela AURIS.
                      </Label>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Resumen de tu registro
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Usuario:</span>
                        <span className="text-foreground ml-2">@{formData.username}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nombre:</span>
                        <span className="text-foreground ml-2">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Correo:</span>
                        <span className="text-foreground ml-2">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Teléfono:</span>
                        <span className="text-foreground ml-2">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ubicación:</span>
                        <span className="text-foreground ml-2">
                          {formData.city}, {formData.state}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="text-primary ml-2">
                          {formData.preferredPlan
                            ? formData.preferredPlan.replace(/_/g, " ").toUpperCase()
                            : "Por definir"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="border-border/50 hover:bg-accent/50 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    disabled={
                      isSubmitting || !formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptDataProcessing
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        Crear Cuenta
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/iniciar-sesion" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
