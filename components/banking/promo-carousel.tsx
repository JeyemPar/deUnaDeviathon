"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Zap,
} from "lucide-react"
import { useDeVaca, getMetaActivaIndex } from "@/lib/devaca-store"

const VERDE = "#00DDA6"
const MORADO = "#432959"

interface Slide {
  id: string
  icon: typeof Sparkles
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  gradient: string
  iconBg: string
  iconColor: string
  textColor: string
  ctaColor: string
}

export function PromoCarousel() {
  const { state } = useDeVaca()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const metaIdx = getMetaActivaIndex(state)
  const metaActiva = state.niveles[metaIdx]
  const faltante = Math.max(0, metaActiva.meta - state.ahorroAcumulado)
  const bonusEsperado = metaActiva.meta * (metaActiva.bonus / 100)

  // Ahorro de esta semana (las transacciones con ahorro > 0, suponemos las
  // primeras 3 son las más recientes en el mock).
  const ahorroSemana = state.transacciones
    .slice(0, 3)
    .reduce((sum, t) => sum + t.ahorro, 0)

  // Promedio diario para predecir cuándo llega a la meta.
  const diasParaMeta =
    ahorroSemana > 0 && faltante > 0
      ? Math.max(1, Math.ceil(faltante / (ahorroSemana / 7)))
      : 0

  const slides: Slide[] = [
    {
      id: "momentum",
      icon: TrendingUp,
      eyebrow: "Esta semana",
      title:
        ahorroSemana > 0
          ? `+$${ahorroSemana.toFixed(2)} ahorrado`
          : "Empieza a ahorrar",
      subtitle:
        ahorroSemana > 0
          ? "Estás construyendo el hábito. ¡Sigue así!"
          : "Activa Ahorro Sugerido en tu próxima compra",
      cta: "Ver mi alcancía",
      gradient: "linear-gradient(135deg, #00DDA6 0%, #00B888 100%)",
      iconBg: "rgba(255,255,255,0.20)",
      iconColor: "#ffffff",
      textColor: "#ffffff",
      ctaColor: "#ffffff",
    },
    {
      id: "bonus",
      icon: Target,
      eyebrow: "Próxima meta",
      title:
        faltante > 0
          ? `Te faltan $${faltante.toFixed(2)}`
          : "¡Meta cumplida! 🎉",
      subtitle:
        faltante > 0
          ? `para ganar ${metaActiva.bonus}% extra (+$${bonusEsperado.toFixed(2)})`
          : `Bonus de ${metaActiva.bonus}% desbloqueado`,
      cta: "Ir a dVaca",
      gradient: "linear-gradient(135deg, #432959 0%, #6B4090 100%)",
      iconBg: "rgba(0, 221, 166, 0.25)",
      iconColor: VERDE,
      textColor: "#ffffff",
      ctaColor: VERDE,
    },
    {
      id: "ia",
      icon: Sparkles,
      eyebrow: "Predicción IA",
      title:
        diasParaMeta > 0
          ? `Llegas a tu meta en ${diasParaMeta} día${diasParaMeta === 1 ? "" : "s"}`
          : "Tu ritmo es excelente",
      subtitle:
        diasParaMeta > 0
          ? "Manteniendo tu ritmo actual de ahorro"
          : "Mantén el hábito para ganar más bonus",
      cta: "Ver detalles",
      gradient: "linear-gradient(135deg, #EDE3F8 0%, #F8F2FF 100%)",
      iconBg: "rgba(67, 41, 89, 0.12)",
      iconColor: MORADO,
      textColor: MORADO,
      ctaColor: MORADO,
    },
    {
      id: "habit",
      icon: Zap,
      eyebrow: "Ahorro Sugerido",
      title: "Cada compra, +centavos a tu alcancía",
      subtitle: "Sin pensarlo. Sin esfuerzo. Solo escanea y paga.",
      cta: "Activar y escanear",
      gradient: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
      iconBg: "rgba(245, 158, 11, 0.20)",
      iconColor: "#D97706",
      textColor: "#7C2D12",
      ctaColor: "#D97706",
    },
  ]

  // Detecta el slide activo según el scroll horizontal (UX mobile-first).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let timeout: ReturnType<typeof setTimeout> | null = null
    const onScroll = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth)
        setActiveIndex(Math.max(0, Math.min(slides.length - 1, i)))
      }, 60)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      if (timeout) clearTimeout(timeout)
    }
  }, [slides.length])

  const goTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-end justify-between px-4">
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            dVaca Insights
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: MORADO }}
          >
            Tu progreso esta semana
          </p>
        </div>
        <Link
          href="/devaca"
          className="text-[11px] font-semibold"
          style={{ color: VERDE }}
        >
          Ver todo →
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1"
      >
        {slides.map((s) => {
          const Icon = s.icon
          const href =
            s.id === "habit" ? "/scanner/devaca" : "/devaca"
          return (
            <Link
              key={s.id}
              href={href}
              className="relative w-full flex-shrink-0 snap-start overflow-hidden rounded-2xl p-4 shadow-sm transition-transform active:scale-[0.99]"
              style={{ background: s.gradient }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: s.iconBg }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: s.iconColor }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide opacity-80"
                    style={{ color: s.textColor }}
                  >
                    {s.eyebrow}
                  </p>
                  <p
                    className="mt-0.5 text-base font-bold leading-tight"
                    style={{ color: s.textColor }}
                  >
                    {s.title}
                  </p>
                  <p
                    className="mt-1 text-[11px] leading-snug opacity-85"
                    style={{ color: s.textColor }}
                  >
                    {s.subtitle}
                  </p>
                  <div
                    className="mt-3 flex items-center gap-1 text-[11px] font-semibold"
                    style={{ color: s.ctaColor }}
                  >
                    {s.cta}
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === activeIndex ? 20 : 6,
              backgroundColor: i === activeIndex ? MORADO : "#D1D5DB",
            }}
          />
        ))}
      </div>
    </div>
  )
}
