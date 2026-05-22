"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X, Check, Store } from "lucide-react"
import { useDeVaca } from "@/lib/devaca-store"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"

const MIPYME_DEMO_ID = "MP001"

type Fase = "escaneando" | "flash" | "detectado"

export default function ScannerDeVacaPage() {
  const router = useRouter()
  const { state } = useDeVaca()
  const mipyme = state.mipymes.find((m) => m.id === MIPYME_DEMO_ID)

  const [fase, setFase] = useState<Fase>("escaneando")
  const [monto, setMonto] = useState("")
  const [conAhorro, setConAhorro] = useState(true)

  useEffect(() => {
    if (fase !== "escaneando") return
    const t1 = setTimeout(() => {
      setFase("flash")
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(80)
      }
    }, 2500)
    return () => clearTimeout(t1)
  }, [fase])

  useEffect(() => {
    if (fase !== "flash") return
    const t = setTimeout(() => setFase("detectado"), 200)
    return () => clearTimeout(t)
  }, [fase])

  const montoNum = parseFloat(monto) || 0
  const puedeContinuar = montoNum > 0 && !!mipyme

  const handleContinuar = () => {
    if (!puedeContinuar || !mipyme) return
    if (conAhorro) {
      router.push(
        `/devaca/pago?mipyme=${mipyme.id}&monto=${montoNum.toFixed(2)}`
      )
    } else {
      router.push("/")
    }
  }

  return (
    <div className="mobile-container relative overflow-hidden bg-black">
      {/* Botón cerrar */}
      <button
        onClick={() => router.push("/")}
        className="absolute left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform active:scale-95"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      {/* Cámara simulada */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <div className="relative h-60 w-60">
          {/* Marco QR — 4 esquinas en verde */}
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />

          {/* Línea roja escaneando */}
          {fase === "escaneando" && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute left-2 right-2 h-[2px] rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #EF4444, transparent)",
                  boxShadow: "0 0 12px #EF4444",
                  animation: "scan-line 1.6s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Checkmark si detectado */}
          {fase !== "escaneando" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full animate-in zoom-in duration-300"
                style={{ backgroundColor: VERDE }}
              >
                <Check className="h-9 w-9 text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-white/80">
          {fase === "escaneando"
            ? "Apunta al código QR del comercio"
            : "QR detectado"}
        </p>
      </div>

      {/* Flash blanco */}
      {fase === "flash" && (
        <div className="absolute inset-0 z-40 bg-white animate-in fade-in duration-150" />
      )}

      {/* Bottom sheet */}
      {fase === "detectado" && mipyme && (
        <div className="absolute inset-0 z-50 flex flex-col">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-black/60 animate-in fade-in duration-200"
            aria-label="Cerrar"
          />
          <div className="rounded-t-3xl bg-white animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-200" />
            <div className="px-5 pt-4 pb-6">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ backgroundColor: VERDE_SOFT }}
              >
                <Check className="h-3 w-3" style={{ color: VERDE }} strokeWidth={3} />
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: VERDE }}
                >
                  QR Detectado
                </span>
              </div>

              {/* Info comercio */}
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: VERDE_SOFT }}
                >
                  <Store className="h-6 w-6" style={{ color: VERDE }} />
                </div>
                <div>
                  <p
                    className="text-lg font-bold leading-tight"
                    style={{ color: MORADO }}
                  >
                    {mipyme.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    Categoría: {mipyme.categoria} · ID: {mipyme.id}
                  </p>
                </div>
              </div>

              {/* Monto */}
              <div className="mt-5 rounded-2xl bg-[#F9FAFB] p-4">
                <label className="text-xs font-medium text-gray-500">
                  Monto a pagar
                </label>
                <div className="mt-1 flex items-baseline gap-2">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: MORADO }}
                  >
                    $
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "")
                      const parts = v.split(".")
                      const clean =
                        parts.length > 2 ? `${parts[0]}.${parts[1]}` : v
                      setMonto(clean)
                    }}
                    autoFocus
                    className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-gray-300"
                    style={{ color: MORADO }}
                  />
                </div>
              </div>

              {/* Toggle ahorro sugerido */}
              <button
                onClick={() => setConAhorro((v) => !v)}
                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-gray-100 transition-colors active:bg-gray-50"
              >
                <div className="text-left">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: MORADO }}
                  >
                    ¿Activar Ahorro Sugerido?
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Suma +${mipyme.ahorro.toFixed(2)} a tu alcancía DeVaca
                  </p>
                </div>
                <ToggleSwitch active={conAhorro} />
              </button>

              {/* Continuar */}
              <button
                onClick={handleContinuar}
                disabled={!puedeContinuar}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
                style={{ backgroundColor: MORADO }}
              >
                Continuar →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-xl",
    tr: "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-xl",
    bl: "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-xl",
    br: "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-xl",
  }
  return (
    <div
      className={`pointer-events-none absolute h-8 w-8 ${map[position]}`}
      style={{ borderColor: VERDE }}
    />
  )
}

function ToggleSwitch({ active }: { active: boolean }) {
  return (
    <div
      className="relative h-6 w-11 rounded-full transition-colors"
      style={{ backgroundColor: active ? VERDE : "#D1D5DB" }}
    >
      <div
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all"
        style={{ left: active ? "calc(100% - 22px)" : "2px" }}
      />
    </div>
  )
}
