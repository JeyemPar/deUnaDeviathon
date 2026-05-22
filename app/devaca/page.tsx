"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  PiggyBank,
  Sparkles,
  Check,
  ShoppingBag,
  Ticket,
  Store,
  X,
  TrendingUp,
  Camera,
  ChevronRight,
  RotateCcw,
} from "lucide-react"
import { useDeVaca, type Transaccion } from "@/lib/devaca-store"

type Tab = "resumen" | "pagar" | "canjear" | "configurar"

const VERDE = "#00DDA6"
const VERDE_SOFT = "rgba(0, 221, 166, 0.15)"
const MORADO = "#432959"
const MORADO_SOFT = "rgba(67, 41, 89, 0.10)"

function getMetaActual(
  ahorro: number,
  niveles: { meta: number; bonus: number }[]
) {
  for (const n of niveles) {
    if (ahorro < n.meta) return n
  }
  return niveles[niveles.length - 1]
}

function getBonusGanadoPct(
  ahorro: number,
  niveles: { meta: number; bonus: number }[]
) {
  let pct = 0
  for (const n of niveles) {
    if (ahorro >= n.meta) pct = n.bonus
  }
  return pct
}

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`
}

export default function DeVacaPage() {
  const router = useRouter()
  const { state, canjearAhorro } = useDeVaca()
  const [activeTab, setActiveTab] = useState<Tab>("resumen")

  const [snackbar, setSnackbar] = useState<{ ahorro: number; total: number } | null>(
    null
  )
  const [showHistorial, setShowHistorial] = useState(false)
  const [selectedCanje, setSelectedCanje] = useState<number | null>(null)
  const [canjeSuccess, setCanjeSuccess] = useState(false)

  const meta = getMetaActual(state.ahorroAcumulado, state.niveles)
  const progreso = Math.min(100, (state.ahorroAcumulado / meta.meta) * 100)
  const bonusGanadoPct = getBonusGanadoPct(state.ahorroAcumulado, state.niveles)
  const bonusGanado = state.ahorroAcumulado * (bonusGanadoPct / 100)
  const bonusEsperado = meta.meta * (meta.bonus / 100)
  const totalCanjeable = state.ahorroAcumulado + bonusGanado
  const totalProyectado = state.ahorroAcumulado + bonusEsperado

  useEffect(() => {
    if (!snackbar) return
    const t = setTimeout(() => setSnackbar(null), 3000)
    return () => clearTimeout(t)
  }, [snackbar])

  useEffect(() => {
    if (!canjeSuccess) return
    const t = setTimeout(() => {
      setCanjeSuccess(false)
      setSelectedCanje(null)
    }, 2200)
    return () => clearTimeout(t)
  }, [canjeSuccess])

  const handleConfirmarCanje = () => {
    if (selectedCanje === null) return
    canjearAhorro(selectedCanje, totalCanjeable)
    setCanjeSuccess(true)
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
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: VERDE_SOFT }}
            >
              <PiggyBank className="h-5 w-5" style={{ color: VERDE }} />
            </div>
            <span className="text-base font-semibold" style={{ color: MORADO }}>
              DeVaca
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2">
          {(
            [
              { id: "resumen", label: "Resumen" },
              { id: "pagar", label: "Pagar" },
              { id: "canjear", label: "Canjear" },
              { id: "configurar", label: "Configurar" },
            ] as { id: Tab; label: string }[]
          ).map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="relative flex-1 py-3 text-xs transition-colors"
                style={{
                  color: active ? MORADO : "#9CA3AF",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {t.label}
                {active && (
                  <div
                    className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full transition-all"
                    style={{ backgroundColor: VERDE }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === "resumen" && (
          <ResumenTab
            ahorro={state.ahorroAcumulado}
            bonusEsperado={bonusEsperado}
            totalProyectado={totalProyectado}
            progreso={progreso}
            meta={meta.meta}
            bonusPct={meta.bonus}
            niveles={state.niveles}
            nombreUsuario={state.nombreUsuario}
            transacciones={state.transacciones}
            onVerTodo={() => setShowHistorial(true)}
          />
        )}

        {activeTab === "pagar" && (
          <PagarTab
            transacciones={state.transacciones}
            mipymes={state.mipymes}
            onEscanear={() => router.push("/scanner/devaca")}
            onPagoRapido={(mipymeId, monto) =>
              router.push(
                `/devaca/pago?mipyme=${mipymeId}&monto=${monto.toFixed(2)}`
              )
            }
          />
        )}

        {activeTab === "canjear" && (
          <CanjearTab
            totalCanjeable={totalCanjeable}
            ahorro={state.ahorroAcumulado}
            metaMinima={state.niveles[0]?.meta ?? 30}
            selected={selectedCanje}
            onSelect={setSelectedCanje}
            onConfirm={handleConfirmarCanje}
          />
        )}

        {activeTab === "configurar" && <ConfigurarTab />}
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center px-4 pt-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className="pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg"
            style={{ backgroundColor: VERDE }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25">
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold">
                ¡+{formatMoney(snackbar.ahorro)} a tu alcancía! 🎉
              </p>
              <p className="text-xs opacity-90">
                Llevas {formatMoney(snackbar.total)} este mes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Historial */}
      {showHistorial && (
        <div className="absolute inset-0 z-50 flex flex-col">
          <button
            onClick={() => setShowHistorial(false)}
            className="flex-1 bg-black/50 animate-in fade-in duration-200"
            aria-label="Cerrar"
          />
          <div className="flex max-h-[85%] flex-col rounded-t-3xl bg-white animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-gray-200" />
            <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-2">
              <h2 className="text-lg font-semibold" style={{ color: MORADO }}>
                Historial completo
              </h2>
              <button
                onClick={() => setShowHistorial(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="shrink-0 px-5 pt-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="mb-3 flex items-center justify-between">
                  <p
                    className="text-xs font-medium"
                    style={{ color: MORADO }}
                  >
                    Progreso semanal
                  </p>
                  <TrendingUp className="h-4 w-4" style={{ color: VERDE }} />
                </div>
                <div className="flex h-20 items-end justify-around gap-3">
                  {[55, 72, 88, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor: VERDE,
                          opacity: i === 3 ? 0.45 : 1,
                        }}
                      />
                      <span className="text-[10px] text-gray-400">
                        {["S1", "S2", "S3", "S4"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 pb-6">
              <div className="space-y-2">
                {state.transacciones.map((t) => (
                  <TransaccionRow key={t.id} t={t} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canje success */}
      {canjeSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-white px-8 py-7 text-center shadow-xl animate-in zoom-in duration-300">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: VERDE }}
            >
              <Check className="h-9 w-9 text-white" strokeWidth={3} />
            </div>
            <p
              className="mt-4 text-lg font-semibold"
              style={{ color: MORADO }}
            >
              ¡Canje realizado!
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {formatMoney(totalCanjeable)} aplicados
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function TransaccionRow({ t }: { t: Transaccion }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: VERDE_SOFT }}
      >
        <Store className="h-5 w-5" style={{ color: VERDE }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{t.lugar}</p>
        <p className="text-xs text-gray-400">{t.fecha}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatMoney(t.monto)}
        </p>
        {t.ahorro > 0 && (
          <p className="text-xs font-medium" style={{ color: VERDE }}>
            +{formatMoney(t.ahorro)} ahorro
          </p>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────── RESUMEN ──────────────────────────────

function ResumenTab({
  ahorro,
  bonusEsperado,
  totalProyectado,
  progreso,
  meta,
  bonusPct,
  niveles,
  nombreUsuario,
  transacciones,
  onVerTodo,
}: {
  ahorro: number
  bonusEsperado: number
  totalProyectado: number
  progreso: number
  meta: number
  bonusPct: number
  niveles: { meta: number; bonus: number }[]
  nombreUsuario: string
  transacciones: Transaccion[]
  onVerTodo: () => void
}) {
  const ultimas = transacciones.slice(0, 2)

  return (
    <div className="space-y-4 px-4 pt-4 pb-6">
      {/* Saludo + perfil IA */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Hola,{" "}
          <span className="font-semibold" style={{ color: MORADO }}>
            {nombreUsuario}
          </span>
        </p>
        <div
          className="flex items-center gap-1 rounded-full px-2.5 py-1"
          style={{ backgroundColor: MORADO_SOFT }}
        >
          <Sparkles className="h-3 w-3" style={{ color: MORADO }} />
          <span
            className="text-[11px] font-medium"
            style={{ color: MORADO }}
          >
            Perfil IA · Activo
          </span>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-4 w-4" style={{ color: VERDE }} />
          <p className="text-xs text-gray-500">Ahorro acumulado</p>
        </div>
        <p
          className="mt-1 text-4xl font-bold tracking-tight"
          style={{ color: VERDE }}
        >
          {formatMoney(ahorro)}
        </p>

        <div
          className="mt-4 flex items-center justify-between rounded-xl px-3 py-2.5"
          style={{ backgroundColor: VERDE_SOFT }}
        >
          <div>
            <p className="text-[11px] text-gray-500">Bonus esperado</p>
            <p
              className="text-base font-semibold"
              style={{ color: VERDE }}
            >
              +{formatMoney(bonusEsperado)}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-right">
            <p className="text-[11px] text-gray-500">Total canjeable</p>
            <p className="text-base font-bold" style={{ color: MORADO }}>
              {formatMoney(totalProyectado)}
            </p>
          </div>
        </div>

        {/* Progreso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Meta {formatMoney(meta)} · {bonusPct}%
            </span>
            <span style={{ color: MORADO }} className="font-semibold">
              {Math.round(progreso)}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progreso}%`,
                backgroundColor: VERDE,
              }}
            />
          </div>
        </div>
      </div>

      {/* Predicción IA */}
      <div
        className="flex items-start gap-2 rounded-2xl px-4 py-3"
        style={{ backgroundColor: MORADO_SOFT }}
      >
        <Sparkles
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: MORADO }}
        />
        <p className="text-xs leading-snug" style={{ color: MORADO }}>
          <span className="font-semibold">IA predice:</span> llegarás a tu meta
          el día 24 del mes 🚀
        </p>
      </div>

      {/* Niveles */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Niveles de bonus
        </p>
        <div className="space-y-2">
          {niveles.map((n, i) => {
            const alcanzado = ahorro >= n.meta
            const enProgreso =
              !alcanzado &&
              (i === 0 || ahorro >= (niveles[i - 1]?.meta ?? 0))

            return (
              <div
                key={`${n.meta}-${i}`}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all"
                style={{
                  backgroundColor: alcanzado ? VERDE_SOFT : "#F9FAFB",
                  boxShadow: alcanzado
                    ? `0 0 0 1.5px ${VERDE}`
                    : enProgreso
                    ? `0 0 0 1.5px ${VERDE}`
                    : "none",
                  animation: enProgreso
                    ? "devaca-pulse 2s ease-in-out infinite"
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: alcanzado ? VERDE : "#E5E7EB",
                    }}
                  >
                    {alcanzado ? (
                      <Check
                        className="h-4 w-4 text-white"
                        strokeWidth={3}
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-gray-500">
                        ${n.meta}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: alcanzado ? MORADO : "#6B7280" }}
                    >
                      Meta {formatMoney(n.meta)}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Bonus {n.bonus}%
                    </p>
                  </div>
                </div>
                {alcanzado ? (
                  <span
                    className="text-[11px] font-semibold uppercase"
                    style={{ color: VERDE }}
                  >
                    Logrado
                  </span>
                ) : enProgreso ? (
                  <span
                    className="text-[11px] font-semibold uppercase"
                    style={{ color: VERDE }}
                  >
                    En curso
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      {/* Últimas transacciones */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Últimas transacciones
          </p>
          <button
            onClick={onVerTodo}
            className="text-xs font-semibold"
            style={{ color: VERDE }}
          >
            Ver todo
          </button>
        </div>
        <div className="space-y-1.5">
          {ultimas.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: VERDE_SOFT }}
                >
                  <Store className="h-4 w-4" style={{ color: VERDE }} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {t.lugar}
                  </p>
                  <p className="text-[11px] text-gray-400">{t.fecha}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatMoney(t.monto)}
                </p>
                {t.ahorro > 0 && (
                  <p
                    className="text-[11px] font-medium"
                    style={{ color: VERDE }}
                  >
                    +{formatMoney(t.ahorro)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ────────────────────────────── PAGAR ──────────────────────────────

function PagarTab({
  transacciones,
  mipymes,
  onEscanear,
  onPagoRapido,
}: {
  transacciones: Transaccion[]
  mipymes: { id: string; nombre: string; categoria: string; ahorro: number }[]
  onEscanear: () => void
  onPagoRapido: (mipymeId: string, monto: number) => void
}) {
  const recientes = transacciones
    .filter((t) => t.ahorro > 0)
    .slice(0, 2)
    .map((t) => ({
      tx: t,
      mipyme: mipymes.find((m) => m.nombre === t.lugar),
    }))
    .filter((r): r is { tx: Transaccion; mipyme: NonNullable<typeof r.mipyme> } => !!r.mipyme)

  return (
    <div className="space-y-5 px-4 pt-6 pb-6">
      {/* CTA Escanear */}
      <button
        onClick={onEscanear}
        className="w-full overflow-hidden rounded-3xl px-5 py-7 text-white shadow-sm transition-transform active:scale-[0.98]"
        style={{
          background: `linear-gradient(135deg, ${MORADO} 0%, #2D1A3D 100%)`,
        }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <p className="mt-4 text-lg font-bold">Escanear QR de MiPyme</p>
        <p className="mt-1 text-xs opacity-80">
          Toca para abrir la cámara y escanear el código del comercio
        </p>
      </button>

      {/* Pagos recientes */}
      {recientes.length > 0 && (
        <div>
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Pagos recientes
          </p>
          <div className="space-y-2">
            {recientes.map(({ tx, mipyme }) => {
              const montoBase = Math.max(0.5, tx.monto - tx.ahorro)
              return (
                <button
                  key={tx.id}
                  onClick={() => onPagoRapido(mipyme.id, montoBase)}
                  className="w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-gray-100 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: VERDE_SOFT }}
                    >
                      <Store className="h-5 w-5" style={{ color: VERDE }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {mipyme.nombre}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Pago rápido · {formatMoney(montoBase)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────── CANJEAR ──────────────────────────────

function CanjearTab({
  totalCanjeable,
  ahorro,
  metaMinima,
  selected,
  onSelect,
  onConfirm,
}: {
  totalCanjeable: number
  ahorro: number
  metaMinima: number
  selected: number | null
  onSelect: (i: number) => void
  onConfirm: () => void
}) {
  const habilitado = ahorro >= metaMinima
  const faltante = Math.max(0, metaMinima - ahorro)
  const progreso = Math.min(100, (ahorro / metaMinima) * 100)

  const opciones = [
    {
      id: 1,
      icon: ShoppingBag,
      color: MORADO,
      titulo: "Comercios grandes",
      desc: "Marathon, supermercados y más",
      ejemplo: `Zapatos $60 → pagas ${formatMoney(Math.max(0, 60 - totalCanjeable))}`,
    },
    {
      id: 2,
      icon: Ticket,
      color: "#0891B2",
      titulo: "Cupón",
      desc: "Descuento en servicios o cashback",
      ejemplo: `${formatMoney(totalCanjeable)} en tu próximo pago de servicios`,
    },
    {
      id: 3,
      icon: Store,
      color: VERDE,
      titulo: "MiPymes locales",
      desc: "Canjea donde ahorraste",
      ejemplo: "Tienda Don Carlos · Comedor La Esquina",
    },
  ]

  return (
    <div className="space-y-4 px-4 pt-4 pb-6">
      {/* Saldo */}
      <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-gray-100">
        <p className="text-xs text-gray-500">Disponible para canjear</p>
        <p
          className="mt-1 text-4xl font-bold tracking-tight"
          style={{ color: MORADO }}
        >
          {formatMoney(totalCanjeable)}
        </p>
        {habilitado && (
          <div
            className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1"
            style={{ backgroundColor: VERDE_SOFT }}
          >
            <Sparkles className="h-3 w-3" style={{ color: VERDE }} />
            <span
              className="text-[11px] font-semibold"
              style={{ color: MORADO }}
            >
              Recomendado para tu perfil
            </span>
          </div>
        )}
      </div>

      {!habilitado ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: VERDE_SOFT }}
            >
              <PiggyBank className="h-5 w-5" style={{ color: VERDE }} />
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold"
                style={{ color: MORADO }}
              >
                Sigue ahorrando para poder canjear
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Te faltan{" "}
                <span className="font-semibold" style={{ color: VERDE }}>
                  {formatMoney(faltante)}
                </span>{" "}
                para alcanzar tu primera meta de {formatMoney(metaMinima)}.
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progreso}%`,
                    backgroundColor: VERDE,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {opciones.map((op) => {
              const active = selected === op.id
              const Icon = op.icon
              return (
                <button
                  key={op.id}
                  onClick={() => onSelect(op.id)}
                  className="w-full rounded-2xl bg-white px-4 py-4 text-left shadow-sm transition-all active:scale-[0.99]"
                  style={{
                    boxShadow: active
                      ? `0 0 0 2px ${VERDE}`
                      : "0 1px 2px rgba(0,0,0,0.05)",
                    border: active ? "none" : "1px solid #F3F4F6",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${op.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: op.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: MORADO }}
                        >
                          {op.titulo}
                        </p>
                        {active && (
                          <div
                            className="flex h-5 w-5 items-center justify-center rounded-full"
                            style={{ backgroundColor: VERDE }}
                          >
                            <Check
                              className="h-3 w-3 text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {op.desc}
                      </p>
                      <p
                        className="mt-2 text-xs font-medium"
                        style={{ color: op.color }}
                      >
                        {op.ejemplo}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <button
              onClick={onConfirm}
              className="w-full rounded-2xl py-4 text-base font-semibold text-white transition-all active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ backgroundColor: MORADO }}
            >
              Confirmar canje · {formatMoney(totalCanjeable)}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ────────────────────────────── CONFIGURAR ──────────────────────────────

function ConfigurarTab() {
  const { state, actualizarNivel, restaurarNiveles } = useDeVaca()

  return (
    <div className="space-y-4 px-4 pt-4 pb-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: MORADO }}>
          Configuración de niveles
        </h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Ajusta las metas y bonuses de DeVaca. Los cambios se reflejan al
          instante en todas las pantallas.
        </p>
      </div>

      <div className="space-y-3">
        {state.niveles.map((nivel, i) => (
          <NivelEditor key={i} index={i} nivel={nivel} onChange={actualizarNivel} />
        ))}
      </div>

      <button
        onClick={restaurarNiveles}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-semibold transition-transform active:scale-[0.98]"
        style={{ borderColor: MORADO, color: MORADO }}
      >
        <RotateCcw className="h-4 w-4" />
        Restaurar valores por defecto
      </button>
    </div>
  )
}

function NivelEditor({
  index,
  nivel,
  onChange,
}: {
  index: number
  nivel: { meta: number; bonus: number }
  onChange: (i: number, campo: "meta" | "bonus", valor: number) => void
}) {
  const extra = (nivel.meta * nivel.bonus) / 100

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between">
        <p
          className="text-sm font-bold"
          style={{ color: MORADO }}
        >
          Nivel {index + 1}
        </p>
        <div
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase"
          style={{ backgroundColor: VERDE_SOFT, color: VERDE }}
        >
          {nivel.bonus}%
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3">
        <label className="text-xs font-medium text-gray-500">
          Meta de ahorro
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#F9FAFB] px-3 py-2 ring-1 ring-gray-100">
          <span className="text-lg font-bold" style={{ color: MORADO }}>
            $
          </span>
          <input
            type="number"
            min={1}
            step={1}
            value={nivel.meta}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              if (!isNaN(v) && v > 0) onChange(index, "meta", v)
            }}
            className="w-full bg-transparent text-lg font-semibold outline-none"
            style={{ color: MORADO }}
          />
        </div>
      </div>

      {/* Bonus */}
      <div className="mt-3">
        <label className="text-xs font-medium text-gray-500">
          Bonus a otorgar
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#F9FAFB] px-3 py-2 ring-1 ring-gray-100">
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={nivel.bonus}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              if (!isNaN(v) && v >= 0 && v <= 100)
                onChange(index, "bonus", v)
            }}
            className="w-full bg-transparent text-lg font-semibold outline-none"
            style={{ color: MORADO }}
          />
          <span className="text-lg font-bold" style={{ color: MORADO }}>
            %
          </span>
        </div>
      </div>

      {/* Preview */}
      <div
        className="mt-3 rounded-xl px-3 py-2.5"
        style={{ backgroundColor: VERDE_SOFT }}
      >
        <p className="text-[11px]" style={{ color: MORADO }}>
          Preview: ahorra{" "}
          <span className="font-semibold">${nivel.meta}</span> → gana{" "}
          <span className="font-semibold">{nivel.bonus}%</span> ={" "}
          <span className="font-bold" style={{ color: VERDE }}>
            ${extra.toFixed(2)} extra
          </span>
        </p>
      </div>
    </div>
  )
}
