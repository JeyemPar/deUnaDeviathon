"use client"

import { Bell, Headphones } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE3F8] ring-[3px] ring-[#F5C842]">
          <span className="text-sm font-semibold text-[#5B2393]">JP</span>
        </div>
        <span className="text-lg font-bold text-foreground">
          Hola John <span className="ml-0.5">👋</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-0.5 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <button>
          <Headphones className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </header>
  )
}
