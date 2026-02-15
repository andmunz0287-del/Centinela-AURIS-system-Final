import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ["username", "firstName", "lastName", "email", "password", "phone"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `El campo ${field} es requerido` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ success: false, error: "El correo electrónico no es válido" }, { status: 400 })
    }

    // Validate password strength
    if (data.password.length < 8) {
      return NextResponse.json(
        { success: false, error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      )
    }

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // In production, you would:
    // 1. Hash the password with bcrypt
    // 2. Store user in database
    // 3. Send verification email via email service (SendGrid, AWS SES, etc.)

    console.log("=== NUEVO REGISTRO ===")
    console.log("Usuario:", data.username)
    console.log("Email:", data.email)
    console.log("Token de verificación:", verificationToken)
    console.log("Expira:", verificationExpiry.toISOString())

    // Generate welcome email
    const emailContent = generateWelcomeEmail(data, verificationToken)
    console.log("\n=== CORREO DE BIENVENIDA ===")
    console.log("Para:", emailContent.to)
    console.log("Asunto:", emailContent.subject)
    console.log("(El HTML del correo se generó correctamente)")

    return NextResponse.json({
      success: true,
      message: "Registro exitoso. Por favor verifica tu correo electrónico.",
      email: data.email,
      verificationToken: verificationToken,
      expiresAt: verificationExpiry.toISOString(),
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json(
      { success: false, error: "Error al procesar el registro. Intenta nuevamente." },
      { status: 500 },
    )
  }
}

function generateVerificationToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

function getPlanName(plan?: string): string {
  const plans: Record<string, string> = {
    home: "AURIS Home - $2,499/mes",
    pymes: "AURIS PYMES - $4,999/mes",
    executive: "AURIS Ejecutivo - $7,999/mes",
    industrial: "AURIS Industrial - $14,999/mes",
    pro: "AURIS Pro - Personalizado",
    undecided: "Por definir",
  }
  return plans[plan || "undecided"] || "Por definir"
}

function generateWelcomeEmail(
  userData: {
    firstName: string
    lastName: string
    username: string
    email: string
    phone: string
    companyName?: string
    preferredPlan?: string
    city?: string
    state?: string
    country?: string
    accountType?: string
  },
  verificationToken: string,
) {
  const verificationUrl = `https://centinela-auris.com/verificar-correo?token=${verificationToken}&email=${encodeURIComponent(userData.email)}`

  return {
    to: userData.email,
    subject: "🛡️ ¡Bienvenido a Centinela AURIS! - Verifica tu correo electrónico",
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a Centinela AURIS</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header con Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🛡️</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">
                CENTINELA <span style="color: #fecaca;">AURIS</span>
              </h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 8px 0 0 0; letter-spacing: 0.5px;">
                Sistema de Seguridad con Inteligencia Artificial
              </p>
            </td>
          </tr>
          
          <!-- Mensaje de Bienvenida -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0; font-weight: 600;">
                ¡Hola, ${userData.firstName}! 👋
              </h2>
              <p style="color: #dc2626; font-size: 16px; margin: 0 0 24px 0; font-weight: 500;">
                Tu cuenta @${userData.username} ha sido creada exitosamente
              </p>
              <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                Gracias por unirte a la familia Centinela AURIS. Estamos comprometidos en brindarte la mejor protección con tecnología de inteligencia artificial de última generación.
              </p>
              
              <!-- Botón de Verificación -->
              <div style="background-color: #262626; border-radius: 12px; padding: 28px; margin-bottom: 32px; border-left: 4px solid #dc2626;">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <span style="font-size: 24px; margin-right: 12px;">📧</span>
                  <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0;">
                    Verifica tu correo electrónico
                  </p>
                </div>
                <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
                  Para activar tu cuenta y acceder a todas las funcionalidades de Centinela AURIS, necesitas verificar tu dirección de correo electrónico. Este enlace expira en <strong style="color: #ffffff;">24 horas</strong>.
                </p>
                <a href="${verificationUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; transition: background-color 0.3s;">
                  ✓ Verificar mi correo electrónico
                </a>
                <p style="color: #71717a; font-size: 12px; margin: 16px 0 0 0;">
                  Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                  <a href="${verificationUrl}" style="color: #dc2626; word-break: break-all;">${verificationUrl}</a>
                </p>
              </div>
              
              <!-- Resumen de Cuenta -->
              <div style="background-color: #262626; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; display: flex; align-items: center;">
                  <span style="margin-right: 10px;">📋</span> Resumen de tu cuenta
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; border-bottom: 1px solid #3f3f46; font-size: 14px;">Nombre completo:</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #3f3f46; text-align: right; font-size: 14px;">${userData.firstName} ${userData.lastName}</td>
                  </tr>
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; border-bottom: 1px solid #3f3f46; font-size: 14px;">Usuario:</td>
                    <td style="color: #dc2626; padding: 10px 0; border-bottom: 1px solid #3f3f46; text-align: right; font-size: 14px; font-weight: 600;">@${userData.username}</td>
                  </tr>
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; border-bottom: 1px solid #3f3f46; font-size: 14px;">Correo electrónico:</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #3f3f46; text-align: right; font-size: 14px;">${userData.email}</td>
                  </tr>
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; border-bottom: 1px solid #3f3f46; font-size: 14px;">Teléfono:</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #3f3f46; text-align: right; font-size: 14px;">${userData.phone}</td>
                  </tr>
                  ${
                    userData.companyName
                      ? `
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; border-bottom: 1px solid #3f3f46; font-size: 14px;">Empresa:</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #3f3f46; text-align: right; font-size: 14px;">${userData.companyName}</td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    userData.city && userData.state
                      ? `
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; border-bottom: 1px solid #3f3f46; font-size: 14px;">Ubicación:</td>
                    <td style="color: #ffffff; padding: 10px 0; border-bottom: 1px solid #3f3f46; text-align: right; font-size: 14px;">${userData.city}, ${userData.state}</td>
                  </tr>
                  `
                      : ""
                  }
                  <tr>
                    <td style="color: #71717a; padding: 10px 0; font-size: 14px;">Plan de interés:</td>
                    <td style="color: #dc2626; padding: 10px 0; text-align: right; font-size: 14px; font-weight: 600;">${getPlanName(userData.preferredPlan)}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Próximos Pasos -->
              <div style="background-color: #262626; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; display: flex; align-items: center;">
                  <span style="margin-right: 10px;">🚀</span> Próximos pasos
                </h3>
                
                <div style="margin-bottom: 16px; display: flex; align-items: flex-start;">
                  <div style="width: 32px; height: 32px; background-color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                    <span style="color: white; font-weight: bold; font-size: 14px;">1</span>
                  </div>
                  <div>
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Verifica tu correo electrónico</p>
                    <p style="color: #a1a1aa; font-size: 13px; margin: 0;">Haz clic en el botón de arriba para activar tu cuenta</p>
                  </div>
                </div>
                
                <div style="margin-bottom: 16px; display: flex; align-items: flex-start;">
                  <div style="width: 32px; height: 32px; background-color: #3f3f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                    <span style="color: white; font-weight: bold; font-size: 14px;">2</span>
                  </div>
                  <div>
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Inicia sesión en tu cuenta</p>
                    <p style="color: #a1a1aa; font-size: 13px; margin: 0;">Accede al panel de control de Centinela AURIS</p>
                  </div>
                </div>
                
                <div style="margin-bottom: 16px; display: flex; align-items: flex-start;">
                  <div style="width: 32px; height: 32px; background-color: #3f3f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                    <span style="color: white; font-weight: bold; font-size: 14px;">3</span>
                  </div>
                  <div>
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Agenda tu instalación</p>
                    <p style="color: #a1a1aa; font-size: 13px; margin: 0;">Un especialista te contactará para coordinar la visita</p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start;">
                  <div style="width: 32px; height: 32px; background-color: #3f3f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0;">
                    <span style="color: white; font-weight: bold; font-size: 14px;">4</span>
                  </div>
                  <div>
                    <p style="color: #ffffff; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Disfruta de la tranquilidad</p>
                    <p style="color: #a1a1aa; font-size: 13px; margin: 0;">Tu propiedad estará protegida 24/7 con IA avanzada</p>
                  </div>
                </div>
              </div>
              
              <!-- Características -->
              <div style="background-color: #262626; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; display: flex; align-items: center;">
                  <span style="margin-right: 10px;">✨</span> Lo que incluye tu cuenta
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px; width: 24px;">✓</td>
                    <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Monitoreo 24/7 con inteligencia artificial avanzada</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px;">✓</td>
                    <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Detección de sonidos críticos (disparos, cristales rotos, gritos)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px;">✓</td>
                    <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Alertas en tiempo real a tu dispositivo móvil</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px;">✓</td>
                    <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Panel de control intuitivo y fácil de usar</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px;">✓</td>
                    <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Soporte técnico especializado</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #22c55e; font-size: 14px;">✓</td>
                    <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">Historial de eventos y reportes mensuales</td>
                  </tr>
                </table>
              </div>
              
              <!-- Alerta de Seguridad -->
              <div style="background-color: #422006; border: 1px solid #854d0e; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="font-size: 20px; margin-right: 12px;">⚠️</span>
                  <div>
                    <p style="color: #fbbf24; font-weight: 600; margin: 0 0 4px 0; font-size: 14px;">Información importante de seguridad</p>
                    <p style="color: #fcd34d; font-size: 13px; margin: 0; line-height: 1.5;">
                      Nunca te pediremos tu contraseña por correo electrónico, teléfono o WhatsApp. Si recibes una solicitud de este tipo, repórtala inmediatamente a <a href="mailto:seguridad@centinela-auris.com" style="color: #fbbf24;">seguridad@centinela-auris.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          
          <!-- Soporte -->
          <tr>
            <td style="background-color: #262626; padding: 28px 40px; text-align: center;">
              <p style="color: #ffffff; font-weight: 600; margin: 0 0 12px 0; font-size: 16px;">¿Necesitas ayuda?</p>
              <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                Nuestro equipo de soporte está disponible 24/7 para asistirte
              </p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <a href="mailto:soporte@centinela-auris.com" style="color: #dc2626; text-decoration: none; font-size: 14px;">📧 soporte@centinela-auris.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <a href="tel:+525512345678" style="color: #dc2626; text-decoration: none; font-size: 14px;">📞 +52 55 1234 5678</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <a href="https://wa.me/525512345678" style="color: #dc2626; text-decoration: none; font-size: 14px;">💬 WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 24px 40px; text-align: center;">
              <p style="color: #52525b; font-size: 12px; margin: 0 0 8px 0;">
                © ${new Date().getFullYear()} Centinela AURIS. Todos los derechos reservados.
              </p>
              <p style="color: #52525b; font-size: 12px; margin: 0 0 12px 0;">
                Este correo fue enviado a ${userData.email} porque te registraste en Centinela AURIS.
              </p>
              <p style="margin: 0;">
                <a href="https://centinela-auris.com/terminos" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 8px;">Términos</a>
                <a href="https://centinela-auris.com/privacidad" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacidad</a>
                <a href="https://centinela-auris.com/soporte" style="color: #dc2626; text-decoration: none; font-size: 12px; margin: 0 8px;">Soporte</a>
                <a href="https://centinela-auris.com/unsubscribe?email=${encodeURIComponent(userData.email)}" style="color: #71717a; text-decoration: none; font-size: 12px; margin: 0 8px;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
¡Bienvenido a Centinela AURIS, ${userData.firstName}!

Tu cuenta @${userData.username} ha sido creada exitosamente.

Para activar tu cuenta, por favor verifica tu correo electrónico visitando el siguiente enlace:
${verificationUrl}

Este enlace expira en 24 horas.

RESUMEN DE TU CUENTA:
- Nombre: ${userData.firstName} ${userData.lastName}
- Usuario: @${userData.username}
- Correo: ${userData.email}
- Teléfono: ${userData.phone}
${userData.companyName ? `- Empresa: ${userData.companyName}` : ""}
${userData.city && userData.state ? `- Ubicación: ${userData.city}, ${userData.state}` : ""}
- Plan de interés: ${getPlanName(userData.preferredPlan)}

PRÓXIMOS PASOS:
1. Verifica tu correo electrónico
2. Inicia sesión en tu cuenta
3. Agenda tu instalación
4. Disfruta de la tranquilidad

¿Necesitas ayuda?
📧 soporte@centinela-auris.com
📞 +52 55 1234 5678
💬 WhatsApp: +52 55 1234 5678

© ${new Date().getFullYear()} Centinela AURIS. Todos los derechos reservados.
    `,
  }
}
