"use client"

import { ExternalLink } from "lucide-react"
import { useState } from "react"

const promos = [
  {
    id: 1,
    title: '¡Gana una TV de 70"!',
    subtitle: "Haz 3 pagos más y participa",
    cta: "Conoce más",
  },
  {
    id: 2,
    title: "Invita a tus amigos",
    subtitle: "Gana $5 por cada referido",
    cta: "Conoce más",
  },
  {
    id: 3,
    title: "Cashback en compras",
    subtitle: "Hasta 10% de vuelta",
    cta: "Conoce más",
  },
  {
    id: 4,
    title: "Sin comisiones",
    subtitle: "Transferencias gratis",
    cta: "Conoce más",
  },
]

export function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="mt-4 px-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {promos.map((promo, index) => (
            <div key={promo.id} className="w-full flex-shrink-0 pr-4">
              <div className="flex items-center justify-between rounded-2xl bg-[#EDE3F8] p-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{promo.title}</h3>
                  <p className="text-sm text-foreground">{promo.subtitle}</p>
                  <button className="mt-2 flex items-center gap-1 text-sm font-medium text-[#5B2393]">
                    {promo.cta}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative h-24 w-28 overflow-hidden rounded-xl bg-[#8FE8C9]">
                  {index === 0 && (
                    <div className="flex h-full w-full items-end justify-center">
                      <div className="relative">
                        {/* Person celebrating illustration */}
                        <div className="absolute -top-2 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-amber-200" />
                        <div className="h-10 w-12 rounded-t-full bg-[#6366F1]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="mt-3 flex justify-center gap-1.5">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-[#5B2393]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
