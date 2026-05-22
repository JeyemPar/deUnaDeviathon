"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Check, PiggyBank, Store } from "lucide-react"
import { useDeVaca } from "@/lib/devaca-store"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"

export default function PagoPage() {
  return (
    <Suspense fallback={<PagoSkeleton />}>
      <PagoContent />
    </Suspense>
  )
}

function PagoSkeleton() {
  return (
    <div
      className="mobile-container"
      style={{ backgroundColor: "#F9FAFB" }}
    />
  )
}

function getMetaActual(ahorro: number, niveles: { meta: number; bonus: number }[]) {
  for (const n of niveles) {
    if (ahorro < n.meta) return n
  }
  return niveles[niveles.length - 1]
}

function PagoContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { state, pagarConAhorro, pagarSinAhorro } = useDeVaca()

  const mipymeId = params.get("mipyme") ?? ""
  const montoRaw = parseFloat(params.get("monto") ?? "0") || 0

  const mipyme = state.mipymes.find((m) => m.id === mipymeId)

  const [exito, setExito] = useState<null | { ahorro: number; total: number }>(
    null
  )

  useEffect(() => {
    if (!exito) return
    const t = setTimeout(() => router.push("/devaca"), 2000)
    return () => clearTimeout(t)
  }, [exito, router])

  if (!mipyme || montoRaw <= 0) {
    return (
      <div
        className="mobile-container items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#F9FAFB" }}
      >
        <p className="text-sm text-gray-600">
          No se pudo cargar la información del pago.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: MORADO }}
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  const ahorro = mipyme.ahorro
  const totalPagar = montoRaw + ahorro
  const ahorroAntes = state.ahorroAcumulado
  const ahorroDespues = ahorroAntes + ahorro

  const meta = getMetaActual(ahorroDespues, state.niveles)
  const progresoDespues = Math.min(100, (ahorroDespues / meta.meta) * 100)
  const faltante = Math.max(0, meta.meta - ahorroDespues)

  const handleAceptar = () => {
    pagarConAhorro(mipyme.id, montoRaw)
    setExito({ ahorro, total: ahorroDespues })
  }

  const handleSinAhorro = () => {
    pagarSinAhorro(mipyme.id, montoRaw)
    router.push("/devaca")
  }

  return (
    <div
      className="mobile-container relative"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-white">
        <div className="flex items-center gap-2 px-3 pt-3 pb-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1
            className="text-base font-semibold"
            style={{ color: MORADO }}
          >
            Confirmar pago
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-6 space-y-4">
        {/* Tarjeta resumen */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          {/* Comercio */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: VERDE_SOFT }}
            >
              <Store className="h-6 w-6" style={{ color: VERDE }} />
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: MORADO }}>
                {mipyme.nombre}
              </p>
              <p className="text-xs text-gray-500">
                {mipyme.categoria} · {mipyme.id}
              </p>
            </div>
          </div>

          {/* Desglose */}
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Desglose
          </p>
          <div className="mt-2 space-y-2.5">
            <Row label="Precio del producto" value={`$${montoRaw.toFixed(2)}`} />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <span aria-hidden>🐄</span> Ahorro Sugerido
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: VERDE }}
              >
                +${ahorro.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2.5">
              <Row
                label="Total a pagar"
                value={`$${totalPagar.toFixed(2)}`}
                bold
              />
            </div>
          </div>

          {/* Alcancía antes/después */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tu alcancía DeVaca
            </p>
            <div
              className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ backgroundColor: VERDE_SOFT }}
            >
              <div className="text-xs" style={{ color: MORADO }}>
                <p className="opacity-70">Antes</p>
                <p className="text-base font-semibold">
                  ${ahorroAntes.toFixed(2)}
                </p>
              </div>
              <span className="text-base font-bold" style={{ color: VERDE }}>
                →
              </span>
              <div className="text-xs text-right" style={{ color: MORADO }}>
                <p className="opacity-70">Después</p>
                <p className="text-base font-semibold">
                  ${ahorroDespues.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progresoDespues}%`,
                  backgroundColor: VERDE,
                }}
              />
            </div>
            <p
              className="mt-2 text-xs"
              style={{ color: MORADO }}
            >
              Nivel actual:{" "}
              <span className="font-semibold">
                {Math.round(progresoDespues)}% hacia tu bonus
              </span>
            </p>
            {faltante > 0 ? (
              <p className="text-xs text-gray-500">
                ¡Solo ${faltante.toFixed(2)} más para ganar {meta.bonus}%!
              </p>
            ) : (
              <p className="text-xs font-semibold" style={{ color: VERDE }}>
                🎉 ¡Bonus del {meta.bonus}% alcanzado!
              </p>
            )}
          </div>
        </div>

        {/* Botones */}
        <button
          onClick={handleAceptar}
          className="w-full rounded-2xl py-4 text-base font-semibold text-white transition-all active:scale-[0.98]"
          style={{ backgroundColor: VERDE }}
        >
          Aceptar y ahorrar ${totalPagar.toFixed(2)}
        </button>
        <button
          onClick={handleSinAhorro}
          className="w-full rounded-2xl border py-4 text-base font-semibold transition-all active:scale-[0.98]"
          style={{ borderColor: MORADO, color: MORADO }}
        >
          Pagar sin ahorro ${montoRaw.toFixed(2)}
        </button>
      </div>

      {/* Overlay éxito */}
      {exito && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-6 animate-in fade-in duration-200">
          <div className="w-full max-w-xs rounded-3xl bg-white px-6 py-7 text-center shadow-2xl animate-in zoom-in duration-300">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: VERDE }}
            >
              <Check
                className="h-11 w-11 text-white animate-in zoom-in duration-500"
                strokeWidth={3}
              />
            </div>
            <p
              className="mt-4 text-lg font-bold"
              style={{ color: MORADO }}
            >
              ¡+${exito.ahorro.toFixed(2)} a tu alcancía! 🎉
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Llevas ${exito.total.toFixed(2)} este mes
            </p>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <PiggyBank className="h-3.5 w-3.5" style={{ color: VERDE }} />
              <span>Redirigiendo a DeVaca…</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-700"}`}
      >
        {label}
      </span>
      <span
        className={bold ? "text-base font-bold" : "text-sm font-medium"}
        style={{ color: bold ? MORADO : "#111827" }}
      >
        {value}
      </span>
    </div>
  )
}
