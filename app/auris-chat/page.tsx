"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"

export default function AurisChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat-auris" }),
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const input = formData.get("message") as string

    if (input.trim()) {
      sendMessage({ text: input })
      e.currentTarget.reset()
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">AURIS</h1>
          <p className="text-muted-foreground">Asistente Inteligente de Centinela AURIS</p>
          <p className="text-sm text-muted-foreground mt-2">
            Pregúntame sobre el sistema, solicita soporte técnico o agenda una demostración
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Hola, soy AURIS</h3>
                <p className="text-muted-foreground max-w-md">
                  Estoy aquí para ayudarte con información sobre Centinela AURIS, soporte técnico y agendar
                  demostraciones. ¿En qué puedo asistirte hoy?
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block px-4 py-3 rounded-lg ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <div key={index} className="whitespace-pre-wrap">
                            {part.text}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              </div>
            ))}

            {status === "in_progress" && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="inline-block px-4 py-3 rounded-lg bg-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-card">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                name="message"
                placeholder="Escribe tu mensaje..."
                disabled={status === "in_progress"}
                className="flex-1"
                autoComplete="off"
              />
              <Button type="submit" disabled={status === "in_progress"} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => sendMessage({ text: "¿Qué es Centinela AURIS?" })}
            disabled={status === "in_progress"}
          >
            ¿Qué es Centinela AURIS?
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => sendMessage({ text: "Quiero agendar una demostración" })}
            disabled={status === "in_progress"}
          >
            Agendar demostración
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            onClick={() => sendMessage({ text: "¿Qué versiones están disponibles?" })}
            disabled={status === "in_progress"}
          >
            Ver versiones disponibles
          </Button>
        </div>
      </div>
    </div>
  )
}
