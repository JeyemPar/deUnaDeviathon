"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  PiggyBank,
  Lock,
  Check,
  X,
  Sparkles,
} from "lucide-react"
import { useDeVaca } from "@/lib/devaca-store"
import {
  BENEFICIOS,
  CATEGORIAS,
  imgFor,
  type Beneficio,
  type CategoriaBeneficio,
} from "@/lib/beneficios-data"
import { BottomNavigation } from "@/components/banking/bottom-navigation"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"

export default function BeneficiosPage() {
  const router = useRouter()
  const { state, canjearAhorro } = useDeVaca()
  const [filtro, setFiltro] = useState<CategoriaBeneficio | "Todos">("Todos")
  const [seleccion, setSeleccion] = useState<Beneficio | null>(null)
  const [canjeExito, setCanjeExito] = useState<Beneficio | null>(null)

  const lista = useMemo(
    () =>
      filtro === "Todos"
        ? BENEFICIOS
        : BENEFICIOS.filter((b) => b.categoria === filtro),
    [filtro]
  )

  useEffect(() => {
    if (!canjeExito) return
    const t = setTimeout(() => setCanjeExito(null), 2200)
    return () => clearTimeout(t)
  }, [canjeExito])

  const handleCanjear = (b: Beneficio) => {
    if (state.ahorroAcumulado < b.costo) return
    canjearAhorro(0, b.costo)
    setSeleccion(null)
    setCanjeExito(b)
  }

  return (
    <div
      className="mobile-container relative"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-white">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <button
            onClick={() => router.push("/")}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
            aria-label="Volver"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1
            className="text-base font-semibold"
            style={{ color: MORADO }}
          >
            Beneficios
          </h1>
          <div className="w-10" />
        </div>

        {/* Saldo DeVaca */}
        <div className="px-4 pb-3">
          <div
            className="flex items-center justify-between rounded-2xl p-3"
            style={{
              background: `linear-gradient(135deg, ${VERDE} 0%, #00B888 100%)`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight text-white">
                <p className="text-[10px] uppercase tracking-wide opacity-90">
                  Disponible para canjear
                </p>
                <p className="text-xl font-bold">
                  ${state.ahorroAcumulado.toFixed(2)}
                </p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-white/80" />
          </div>
        </div>

        {/* Chips de categorías */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIAS.map((c) => {
            const active = filtro === c.id
            return (
              <button
                key={c.id}
                onClick={() => setFiltro(c.id)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
                style={{
                  backgroundColor: active ? MORADO : "#F3F4F6",
                  color: active ? "#fff" : "#6B7280",
                }}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grilla de beneficios */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
        {lista.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            No hay beneficios en esta categoría todavía.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {lista.map((b) => {
              const puede = state.ahorroAcumulado >= b.costo
              const faltante = Math.max(
                0,
                b.costo - state.ahorroAcumulado
              )
              return (
                <button
                  key={b.id}
                  onClick={() => setSeleccion(b)}
                  className="overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-100 transition-transform active:scale-[0.98]"
                >
                  <div className="relative h-28 w-full overflow-hidden bg-gray-100">
                    <img
                      src={imgFor(b)}
                      alt={`${b.marca} — ${b.titulo}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
                      style={{ backgroundColor: b.color }}
                    >
                      {b.marca}
                    </div>
                    <div
                      className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur-sm"
                      style={{ color: b.color }}
                    >
                      -{b.descuentoPct}%
                    </div>
                    {!puede && (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
                    )}
                  </div>
                  <div className="p-3">
                    <p
                      className="line-clamp-2 text-[13px] font-semibold leading-tight"
                      style={{ color: MORADO }}
                    >
                      {b.titulo}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">
                      {b.descripcion}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className="text-sm font-bold"
                        style={{ color: puede ? VERDE : "#9CA3AF" }}
                      >
                        ${b.costo.toFixed(2)}
                      </span>
                      {puede ? (
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                          style={{
                            backgroundColor: VERDE_SOFT,
                            color: VERDE,
                          }}
                        >
                          Canjear
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] font-medium text-gray-400">
                          <Lock className="h-3 w-3" />
                          -${faltante.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="shrink-0">
        <BottomNavigation />
      </div>

      {/* Bottom sheet de detalle */}
      {seleccion && (
        <DetalleBeneficio
          beneficio={seleccion}
          ahorro={state.ahorroAcumulado}
          onClose={() => setSeleccion(null)}
          onCanjear={() => handleCanjear(seleccion)}
        />
      )}

      {/* Éxito */}
      {canjeExito && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6 animate-in fade-in duration-200">
          <div className="w-full max-w-xs rounded-3xl bg-white px-6 py-7 text-center shadow-2xl animate-in zoom-in duration-300">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: VERDE }}
            >
              <Check className="h-9 w-9 text-white" strokeWidth={3} />
            </div>
            <p
              className="mt-4 text-lg font-bold"
              style={{ color: MORADO }}
            >
              ¡Cupón canjeado!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {canjeExito.marca} · {canjeExito.titulo}
            </p>
            <p className="mt-3 text-[11px] text-gray-400">
              Lo encontrarás en "Mis cupones"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function DetalleBeneficio({
  beneficio,
  ahorro,
  onClose,
  onCanjear,
}: {
  beneficio: Beneficio
  ahorro: number
  onClose: () => void
  onCanjear: () => void
}) {
  const puede = ahorro >= beneficio.costo
  const faltante = Math.max(0, beneficio.costo - ahorro)

  return (
    <div className="absolute inset-0 z-40 flex flex-col">
      <button
        onClick={onClose}
        className="flex-1 bg-black/50 animate-in fade-in duration-200"
        aria-label="Cerrar"
      />
      <div className="flex max-h-[88%] flex-col overflow-hidden rounded-t-3xl bg-white animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-gray-200" />
        <button
          onClick={onClose}
          className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Imagen grande */}
          <div className="relative mx-5 mt-4 h-44 overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={imgFor(beneficio)}
              alt={beneficio.marca}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute left-3 top-3 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm"
              style={{ backgroundColor: beneficio.color }}
            >
              {beneficio.marca}
            </div>
            <div
              className="absolute right-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold backdrop-blur-sm"
              style={{ color: beneficio.color }}
            >
              -{beneficio.descuentoPct}%
            </div>
          </div>

          <div className="px-5 pt-4 pb-5">
            <p
              className="text-[10px] font-semibold uppercase tracking-wide text-gray-400"
            >
              {beneficio.categoria}
            </p>
            <h2
              className="mt-0.5 text-lg font-bold leading-tight"
              style={{ color: MORADO }}
            >
              {beneficio.titulo}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {beneficio.descripcion}
            </p>

            <div
              className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                  Costo
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: VERDE }}
                >
                  ${beneficio.costo.toFixed(2)}
                </p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                  Tu ahorro
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: MORADO }}
                >
                  ${ahorro.toFixed(2)}
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: VERDE }}
                  strokeWidth={3}
                />
                <span>Válido por 30 días desde el canje</span>
              </li>
              <li className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: VERDE }}
                  strokeWidth={3}
                />
                <span>
                  Se aplica al presentar el código en {beneficio.marca}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  style={{ color: VERDE }}
                  strokeWidth={3}
                />
                <span>No acumulable con otras promociones</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Acción */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4">
          <button
            onClick={onCanjear}
            disabled={!puede}
            className="w-full rounded-2xl py-4 text-base font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: puede ? MORADO : "#9CA3AF" }}
          >
            {puede
              ? `Canjear por $${beneficio.costo.toFixed(2)}`
              : `Te faltan $${faltante.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
