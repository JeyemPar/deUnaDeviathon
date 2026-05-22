"use client"

import {
  ChevronRight,
  Eye,
  Sparkles,
  ChevronsRight,
  PiggyBank,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useDeVaca } from "@/lib/devaca-store"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"

export function BalanceCard() {
  const { state } = useDeVaca()
  const [showBalance, setShowBalance] = useState(true)

  // Próxima meta a alcanzar (la primera que aún no se cumple)
  const metaActual =
    state.niveles.find((n) => state.ahorroAcumulado < n.meta) ??
    state.niveles[state.niveles.length - 1]
  const progresoDevaca = Math.min(
    100,
    (state.ahorroAcumulado / metaActual.meta) * 100
  )
  const faltante = Math.max(0, metaActual.meta - state.ahorroAcumulado)
  const bonusEsperado = metaActual.meta * (metaActual.bonus / 100)
  const metaAlcanzada = state.ahorroAcumulado >= metaActual.meta

  return (
    <div className="mx-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Balance Section */}
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Saldo disponible</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">
              {showBalance
                ? `$${state.saldoPrincipal.toFixed(2)}`
                : "••••••"}
            </span>
            <button onClick={() => setShowBalance(!showBalance)}>
              <Eye className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400" />
      </div>

      {/* Spending Banner */}
      <div className="mx-4 flex items-center gap-2 rounded-lg bg-[#F5F0FA] px-3 py-2.5">
        <Sparkles className="h-5 w-5 text-[#5B2393]" />
        <span className="text-sm text-[#5B2393] underline decoration-[#5B2393] underline-offset-2">
          Gastaste $ 107,90 los últimos 30 días
        </span>
      </div>

      {/* Reload Section */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <div>
          <p className="text-sm text-muted-foreground">Recargar desde</p>
          <p className="text-sm font-medium text-foreground">
            Principal ******4039
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-foreground shadow-sm">
            + $20
          </button>
          <ChevronsRight className="h-5 w-5 text-gray-400" />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B2393]">
            <span className="text-xs font-bold text-white">d!</span>
          </div>
        </div>
      </div>

      {/* Cuenta DeVaca · Ahorros */}
      <Link
        href="/devaca"
        className="block border-t border-gray-100 px-4 py-3.5 transition-colors active:bg-gray-50"
        style={{
          background: `linear-gradient(135deg, ${VERDE_SOFT} 0%, rgba(255,255,255,0) 70%)`,
        }}
      >
        {/* Header del módulo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: VERDE_SOFT }}
            >
              <PiggyBank className="h-5 w-5" style={{ color: VERDE }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p
                  className="text-sm font-semibold"
                  style={{ color: MORADO }}
                >
                  Mi alcancía DeVaca
                </p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: VERDE }}
                >
                  Activa
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Ahorro automático con bonus
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>

        {/* Monto + Bonus */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-500">
              Ahorrado este mes
            </p>
            <p
              className="text-3xl font-bold leading-none"
              style={{ color: VERDE }}
            >
              ${state.ahorroAcumulado.toFixed(2)}
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
            style={{ backgroundColor: "rgba(67, 41, 89, 0.10)" }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: MORADO }} />
            <div className="text-right leading-tight">
              <p
                className="text-[10px] font-medium"
                style={{ color: MORADO }}
              >
                Bonus esperado
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: MORADO }}
              >
                +${bonusEsperado.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-500">
              Meta ${metaActual.meta}{" "}
              <span
                className="ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={{
                  backgroundColor: VERDE_SOFT,
                  color: VERDE,
                }}
              >
                {metaActual.bonus}%
              </span>
            </span>
            <span
              className="font-semibold"
              style={{ color: MORADO }}
            >
              {Math.round(progresoDevaca)}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progresoDevaca}%`,
                background: `linear-gradient(90deg, ${VERDE} 0%, #00C9A0 100%)`,
              }}
            />
          </div>
          {metaAlcanzada ? (
            <p
              className="mt-2 text-[11px] font-semibold"
              style={{ color: VERDE }}
            >
              🎉 ¡Meta alcanzada! Ya ganaste tu bonus
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-gray-500">
              Te faltan{" "}
              <span
                className="font-bold"
                style={{ color: VERDE }}
              >
                ${faltante.toFixed(2)}
              </span>{" "}
              para ganar el bonus del{" "}
              <span
                className="font-bold"
                style={{ color: MORADO }}
              >
                {metaActual.bonus}%
              </span>{" "}
              🚀
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}
