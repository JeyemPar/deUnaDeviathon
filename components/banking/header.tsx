"use client"

import { Bell, Headphones, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useDeVaca } from "@/lib/devaca-store"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"

function obtenerIniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

export function Header() {
  const { state } = useDeVaca()
  const iniciales = obtenerIniciales(state.nombreUsuario)

  return (
    <header className="px-4 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE3F8] ring-[3px] ring-[#F5C842]">
            <span className="text-sm font-semibold text-[#5B2393]">
              {iniciales}
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-[11px] text-gray-500">Hola</p>
            <p className="text-base font-bold text-foreground">
              {state.nombreUsuario} <span className="ml-0.5">👋</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50"
            aria-label="Soporte"
          >
            <Headphones className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Chip alcancía dVaca */}
      <Link
        href="/devaca"
        className="mt-3 flex items-center justify-between rounded-2xl px-3 py-2 transition-transform active:scale-[0.98]"
        style={{
          background: `linear-gradient(90deg, ${VERDE_SOFT} 0%, rgba(67,41,89,0.06) 100%)`,
        }}
      >
        <div className="flex items-center gap-2">
          <img
            src="/devaca.png"
            alt="dVaca"
            className="h-7 w-7 rounded-lg object-contain"
          />
          <div className="leading-tight">
            <p className="text-[10px] uppercase tracking-wide text-gray-500">
              Tu alcancía dVaca
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: MORADO }}
            >
              ${state.ahorroAcumulado.toFixed(2)}{" "}
              <span className="text-[11px] font-medium text-gray-500">
                ahorrado este mes
              </span>
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </Link>
    </header>
  )
}
