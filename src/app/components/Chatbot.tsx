"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      const userMessage: Message = { role: "user", content: input }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        const { text } = await generateText({
          model: openai("gpt-o1"),
          prompt: input,
          system:
            "You are a helpful assistant for a luxury perfume brand called Olyssé. Provide concise and elegant responses.",
        })

        const assistantMessage: Message = { role: "assistant", content: text }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error("Error generating response:", error)
        const errorMessage: Message = {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding at the moment. Please try again later.",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 bg-accent text-accent-foreground rounded-full p-4 shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 w-80 h-96 bg-background rounded-lg shadow-xl overflow-hidden flex flex-col z-50"
          >
            <div className="bg-accent text-accent-foreground p-4">
              <h3 className="font-serif text-lg">Olyssé Assistant</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our perfumes..."
                  className="flex-grow p-2 rounded-l border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={isLoading}
                />
                <button type="submit" className="bg-accent text-accent-foreground p-2 rounded-r" disabled={isLoading}>
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
