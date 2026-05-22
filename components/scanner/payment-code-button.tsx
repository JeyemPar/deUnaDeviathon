"use client"

export function PaymentCodeButton() {
  return (
    <div className="flex justify-center px-6">
      <button 
        className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-xl transition-all active:scale-95"
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        <span className="text-sm font-medium text-white/70">123</span>
        <span className="text-base font-semibold text-white">
          Codigo unico de pago
        </span>
      </button>
    </div>
  )
}
