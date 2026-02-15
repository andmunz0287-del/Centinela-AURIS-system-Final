"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    "¿Qué es Centinela AURIS?",
    "Quiero agendar una cita",
    "Información de planes",
    "Soporte técnico",
  ]

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat-auris", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""
      const assistantMessageId = (Date.now() + 1).toString()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          setMessages((prev) => {
            const existing = prev.find((m) => m.id === assistantMessageId)
            if (existing) {
              return prev.map((m) => (m.id === assistantMessageId ? { ...m, content: assistantMessage } : m))
            } else {
              return [
                ...prev,
                {
                  id: assistantMessageId,
                  role: "assistant",
                  content: assistantMessage,
                },
              ]
            }
          })
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    // Trigger submit after setting input
    setTimeout(() => {
      const form = document.querySelector("form")
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }, 0)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Abrir chat AURIS"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse-glow" />

            {/* Logo button */}
            <div className="relative w-16 h-16 bg-background border-2 border-primary rounded-full shadow-2xl shadow-primary/50 hover:scale-110 transition-transform duration-300 flex items-center justify-center overflow-hidden">
              <Image
                src="/centinela-auris-logo.png"
                alt="AURIS"
                width={56}
                height={56}
                className="object-contain p-1"
              />
            </div>

            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">AI</span>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/centinela-auris-logo.png" alt="AURIS" width={40} height={40} className="object-contain" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AURIS</h3>
                <p className="text-xs text-muted-foreground">Asistente Virtual</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <ScrollArea ref={scrollAreaRef} className="h-[calc(600px-140px)] p-4">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 flex-shrink-0">
                        <Image
                          src="/centinela-auris-logo.png"
                          alt="AURIS"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="bg-accent rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                        <p className="text-sm text-foreground">
                          ¡Hola! Soy AURIS, tu asistente virtual de Centinela AURIS. ¿En qué puedo ayudarte hoy?
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2 pt-2">
                      <p className="text-xs text-muted-foreground px-2">Acciones rápidas:</p>
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action)}
                          className="w-full text-left px-3 py-2 text-sm bg-accent/50 hover:bg-accent rounded-lg transition-colors border border-border/50"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 flex-shrink-0">
                            <Image
                              src="/centinela-auris-logo.png"
                              alt="AURIS"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl p-3 max-w-[80%] ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-accent text-foreground rounded-tl-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 flex-shrink-0">
                          <Image
                            src="/centinela-auris-logo.png"
                            alt="AURIS"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="bg-accent rounded-2xl rounded-tl-sm p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm rounded-b-2xl">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 bg-background border-border"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
