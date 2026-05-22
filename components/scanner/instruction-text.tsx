"use client"

export function InstructionText() {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-white">
        Escanea un QR{" "}
        <span 
          className="font-extrabold italic"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          deuna!
        </span>
      </p>
      <p className="mt-2 text-sm text-white/80">
        para hacer pagos, retiros o verificaciones
      </p>
    </div>
  )
}
