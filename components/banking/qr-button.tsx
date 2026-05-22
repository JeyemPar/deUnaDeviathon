"use client"

import { QrCode } from "lucide-react"
import Link from "next/link"

export function QRButton() {
  return (
    <div className="px-4 py-3">
      <Link 
        href="/scanner"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5B2393] py-4 text-white shadow-lg transition-transform active:scale-[0.98]"
      >
        <QrCode className="h-5 w-5" />
        <span className="text-base font-semibold">Escanear QR</span>
      </Link>
    </div>
  )
}
