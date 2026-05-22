"use client"

import { Home, Gift, Wallet, User } from "lucide-react"
import { useState } from "react"

const navItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "beneficios", label: "Beneficios", icon: Gift },
  { id: "billetera", label: "Billetera", icon: Wallet },
  { id: "tu", label: "Tú", icon: User },
]

export function BottomNavigation() {
  const [active, setActive] = useState("inicio")

  return (
    <nav className="border-t border-gray-100 bg-white">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="flex flex-col items-center gap-1 px-4 py-1"
          >
            <item.icon
              className={`h-6 w-6 ${
                active === item.id ? "text-[#5B2393]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs ${
                active === item.id
                  ? "font-medium text-[#5B2393]"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
