"use client"

import { useState, useEffect } from "react"
import { Signal, Wifi, Battery } from "lucide-react"

interface StatusBarProps {
  variant?: "light" | "dark"
}

export function StatusBar({ variant = "light" }: StatusBarProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("es-EC", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [])

  const textColor = variant === "dark" ? "text-white" : "text-black"

  return (
    <div className={`flex items-center justify-between px-6 py-2 ${textColor}`}>
      <span className="text-sm font-semibold tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  )
}
