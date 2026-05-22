"use client"

import { ChevronRight, Eye, Sparkles, ChevronsRight } from "lucide-react"
import { useState } from "react"

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div className="mx-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Balance Section */}
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Saldo disponible</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">
              {showBalance ? "$10,45" : "••••••"}
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
          <p className="text-sm font-medium text-foreground">Principal ******4059</p>
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
    </div>
  )
}
