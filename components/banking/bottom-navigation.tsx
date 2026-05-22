"use client"

import { Home, Gift, Wallet, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { id: "inicio", label: "Inicio", icon: Home, href: "/" },
  { id: "beneficios", label: "Beneficios", icon: Gift, href: "/beneficios" },
  { id: "billetera", label: "Billetera", icon: Wallet, href: "/devaca" },
  { id: "tu", label: "Tú", icon: User, href: "/" },
] as const

export function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav
      className="border-t border-gray-100 bg-white"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <item.icon
                className={`h-6 w-6 ${
                  active ? "text-[#5B2393]" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs ${
                  active
                    ? "font-medium text-[#5B2393]"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
