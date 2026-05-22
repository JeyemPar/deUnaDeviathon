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
  SEGMENTOS,
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
  const { state, canjearAhorro, marcarBeneficioCanjeado } = useDeVaca()
  const [filtro, setFiltro] = useState<CategoriaBeneficio | "Todos">("Todos")
  const [seleccion, setSeleccion] = useState<Beneficio | null>(null)
  const [canjeExito, setCanjeExito] = useState<Beneficio | null>(null)

  const yaCanjeado = (id: string) => state.beneficiosCanjeados.includes(id)

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
    if (yaCanjeado(b.id)) return
    if (state.ahorroAcumulado < b.costo) return
    canjearAhorro(0, b.costo)
    marcarBeneficioCanjeado(b.id)
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
        <div className="px-4 pb-2">
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

        {/* Banner economía circular */}
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-2.5 rounded-2xl px-3 py-2"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,221,166,0.10) 0%, rgba(67,41,89,0.08) 100%)",
            }}
          >
            <span className="text-base">🔄</span>
            <div className="leading-tight">
              <p
                className="text-[11px] font-bold"
                style={{ color: MORADO }}
              >
                Tu ahorro vuelve a vos
              </p>
              <p className="text-[10px] text-gray-600">
                Ahorras en MiPymes → canjeás en Comercios, MiPymes o Cupones
              </p>
            </div>
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

      {/* Beneficios — segmentados cuando "Todos", grilla plana cuando hay filtro */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
        {lista.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            No hay beneficios en esta categoría todavía.
          </p>
        ) : filtro === "Todos" ? (
          <div className="space-y-5">
            {SEGMENTOS.map((seg) => {
              const items = BENEFICIOS.filter(
                (b) => b.categoria === seg.id
              )
              if (items.length === 0) return null
              return (
                <section key={seg.id}>
                  <div className="mb-2 flex items-start gap-2">
                    <span className="text-lg leading-none">{seg.icono}</span>
                    <div className="leading-tight">
                      <h2
                        className="text-sm font-bold"
                        style={{ color: MORADO }}
                      >
                        {seg.titulo}
                      </h2>
                      <p className="text-[11px] text-gray-500">
                        {seg.descripcion}
                      </p>
                    </div>
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: "#F3F4F6",
                        color: "#6B7280",
                      }}
                    >
                      {items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {items.map((b) => (
                      <BeneficioCard
                        key={b.id}
                        b={b}
                        canjeado={yaCanjeado(b.id)}
                        ahorro={state.ahorroAcumulado}
                        onClick={() => setSeleccion(b)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {lista.map((b) => (
              <BeneficioCard
                key={b.id}
                b={b}
                canjeado={yaCanjeado(b.id)}
                ahorro={state.ahorroAcumulado}
                onClick={() => setSeleccion(b)}
              />
            ))}
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
          canjeado={yaCanjeado(seleccion.id)}
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

function BeneficioCard({
  b,
  canjeado,
  ahorro,
  onClick,
}: {
  b: Beneficio
  canjeado: boolean
  ahorro: number
  onClick: () => void
}) {
  const puede = !canjeado && ahorro >= b.costo
  const faltante = Math.max(0, b.costo - ahorro)

  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-100 transition-transform active:scale-[0.98]"
      style={canjeado ? { opacity: 0.65 } : undefined}
    >
      <div
        className="relative h-28 w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${b.color} 0%, ${b.color}CC 100%)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl">
          <span
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
          >
            {b.emoji}
          </span>
        </div>
        <img
          src={imgFor(b)}
          alt={`${b.marca} — ${b.titulo}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
          style={canjeado ? { filter: "grayscale(1)" } : undefined}
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
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
        {canjeado ? (
          <>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="-rotate-12 rounded-md border-2 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white"
                style={{
                  borderColor: "rgba(255,255,255,0.9)",
                  backgroundColor: "rgba(0,0,0,0.35)",
                }}
              >
                Canjeado
              </span>
            </div>
          </>
        ) : !puede ? (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        ) : null}
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
            style={{
              color: canjeado ? "#9CA3AF" : puede ? VERDE : "#9CA3AF",
              textDecoration: canjeado ? "line-through" : "none",
            }}
          >
            ${b.costo.toFixed(2)}
          </span>
          {canjeado ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-gray-500">
              <Check className="h-3 w-3" strokeWidth={3} />
              Usado
            </span>
          ) : puede ? (
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
              style={{ backgroundColor: VERDE_SOFT, color: VERDE }}
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
}

function DetalleBeneficio({
  beneficio,
  ahorro,
  canjeado,
  onClose,
  onCanjear,
}: {
  beneficio: Beneficio
  ahorro: number
  canjeado: boolean
  onClose: () => void
  onCanjear: () => void
}) {
  const puede = !canjeado && ahorro >= beneficio.costo
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
          <div
            className="relative mx-5 mt-4 h-44 overflow-hidden rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${beneficio.color} 0%, ${beneficio.color}CC 100%)`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl">
              <span
                style={{
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))",
                }}
              >
                {beneficio.emoji}
              </span>
            </div>
            <img
              src={imgFor(beneficio)}
              alt={beneficio.marca}
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover"
              style={canjeado ? { filter: "grayscale(1)" } : undefined}
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
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
            {canjeado && (
              <>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="-rotate-12 rounded-lg border-2 px-4 py-1.5 text-lg font-extrabold uppercase tracking-widest text-white"
                    style={{
                      borderColor: "rgba(255,255,255,0.9)",
                      backgroundColor: "rgba(0,0,0,0.35)",
                    }}
                  >
                    Canjeado
                  </span>
                </div>
              </>
            )}
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
            {canjeado
              ? "Cupón ya canjeado"
              : puede
              ? `Canjear por $${beneficio.costo.toFixed(2)}`
              : `Te faltan $${faltante.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
