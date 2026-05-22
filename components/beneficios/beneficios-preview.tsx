"use client"

import Link from "next/link"
import { Gift, Lock } from "lucide-react"
import { useDeVaca } from "@/lib/devaca-store"
import { BENEFICIOS, imgFor } from "@/lib/beneficios-data"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"

export function BeneficiosPreview() {
  const { state } = useDeVaca()
  // Mostramos los 5 más baratos para inspirar (los que ya puede o casi puede canjear).
  const seleccion = [...BENEFICIOS].sort((a, b) => a.costo - b.costo).slice(0, 5)

  return (
    <section className="mt-5">
      <div className="mb-2 flex items-end justify-between px-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-xl"
            style={{ backgroundColor: VERDE_SOFT }}
          >
            <Gift className="h-4 w-4" style={{ color: VERDE }} />
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Canjea tu ahorro
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: MORADO }}
            >
              Beneficios para ti
            </p>
          </div>
        </div>
        <Link
          href="/beneficios"
          className="text-[11px] font-semibold"
          style={{ color: VERDE }}
        >
          Ver todos →
        </Link>
      </div>

      <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {seleccion.map((b) => {
          const puede = state.ahorroAcumulado >= b.costo
          const faltante = Math.max(0, b.costo - state.ahorroAcumulado)
          return (
            <Link
              key={b.id}
              href="/beneficios"
              className="relative w-40 flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-transform active:scale-[0.98]"
            >
              {/* Imagen */}
              <div
                className="relative h-24 w-full overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${b.color} 0%, ${b.color}CC 100%)`,
                }}
              >
                {/* Fallback: emoji grande sobre el gradiente de marca */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl">
                  <span style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
                    {b.emoji}
                  </span>
                </div>
                {/* Imagen AI encima — si carga, tapa el fallback */}
                <img
                  src={imgFor(b)}
                  alt={`${b.marca} — ${b.titulo}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
                {/* Badge marca */}
                <div
                  className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm"
                  style={{ backgroundColor: b.color }}
                >
                  {b.marca}
                </div>
                {/* Badge descuento */}
                <div
                  className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-sm"
                  style={{ color: b.color }}
                >
                  -{b.descuentoPct}%
                </div>
              </div>

              <div className="p-2.5">
                <p
                  className="line-clamp-2 text-[12px] font-semibold leading-tight"
                  style={{ color: MORADO }}
                >
                  {b.titulo}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: puede ? VERDE : "#9CA3AF" }}
                  >
                    ${b.costo.toFixed(2)}
                  </span>
                  {puede ? (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                      style={{
                        backgroundColor: VERDE_SOFT,
                        color: VERDE,
                      }}
                    >
                      Disponible
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[9px] font-medium text-gray-400">
                      <Lock className="h-2.5 w-2.5" />
                      -${faltante.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
