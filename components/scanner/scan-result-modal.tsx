"use client"

import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScanResultModalProps {
  isOpen: boolean
  result: string | null
  onClose: () => void
  onConfirm: () => void
}

export function ScanResultModal({ isOpen, result, onClose, onConfirm }: ScanResultModalProps) {
  if (!isOpen || !result) return null

  // Parse QR data (in real app, this would parse actual payment data)
  const parseQRData = (data: string) => {
    // Check if it's a URL or payment data
    if (data.startsWith("http")) {
      return {
        type: "url",
        merchant: "Enlace detectado",
        amount: null,
        data: data
      }
    }
    
    // Try to parse as JSON payment data
    try {
      const parsed = JSON.parse(data)
      return {
        type: "payment",
        merchant: parsed.merchant || "Comercio",
        amount: parsed.amount || null,
        data: data
      }
    } catch {
      return {
        type: "text",
        merchant: "Codigo QR detectado",
        amount: null,
        data: data
      }
    }
  }

  const qrData = parseQRData(result)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md animate-slide-up rounded-t-3xl bg-white px-6 pb-8 pt-6">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-xl font-bold text-zinc-900">
          QR Escaneado
        </h2>

        {/* Merchant/Data Info */}
        <div className="mb-6 rounded-2xl bg-zinc-50 p-4">
          <p className="text-center text-sm text-zinc-500">
            {qrData.type === "payment" ? "Comercio" : "Contenido"}
          </p>
          <p className="text-center font-semibold text-zinc-900">
            {qrData.merchant}
          </p>
          
          {qrData.amount && (
            <div className="mt-3 border-t border-zinc-200 pt-3">
              <p className="text-center text-sm text-zinc-500">Monto</p>
              <p className="text-center text-2xl font-bold text-zinc-900">
                ${qrData.amount}
              </p>
            </div>
          )}

          {/* Raw Data (truncated) */}
          <div className="mt-3 border-t border-zinc-200 pt-3">
            <p className="text-center text-xs text-zinc-400 break-all line-clamp-2">
              {qrData.data}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl py-6"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1 rounded-xl bg-emerald-500 py-6 hover:bg-emerald-600"
            onClick={onConfirm}
          >
            {qrData.type === "payment" ? "Pagar" : "Continuar"}
          </Button>
        </div>

        {/* deuna! branding */}
        <div className="mt-4 flex items-center justify-center gap-1">
          <span className="text-xs text-zinc-400">Procesado por</span>
          <span 
            className="text-sm font-bold"
            style={{
              background: 'linear-gradient(90deg, #10B981, #34D399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            deuna!
          </span>
        </div>

        <style jsx>{`
          @keyframes slide-up {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  )
}
