"use client"

import { QRMockPayment } from "./qr-mock-payment"

export function ScannerFrame() {
  return (
    <div className="relative">
      {/* Scanner Frame */}
      <div 
        className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-[40px] border-4 border-white/60 bg-white"
        style={{
          boxShadow: '0 0 40px rgba(255,255,255,0.1), inset 0 0 40px rgba(255,255,255,0.05)'
        }}
      >
        {/* Simulated QR Code */}
        <QRMockPayment />
      </div>
      
      {/* Corner Accents */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top Left */}
        <div className="absolute left-0 top-0 h-16 w-16">
          <div className="absolute left-0 top-0 h-8 w-1 rounded-full bg-white/80" />
          <div className="absolute left-0 top-0 h-1 w-8 rounded-full bg-white/80" />
        </div>
        
        {/* Top Right */}
        <div className="absolute right-0 top-0 h-16 w-16">
          <div className="absolute right-0 top-0 h-8 w-1 rounded-full bg-white/80" />
          <div className="absolute right-0 top-0 h-1 w-8 rounded-full bg-white/80" />
        </div>
        
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 h-16 w-16">
          <div className="absolute bottom-0 left-0 h-8 w-1 rounded-full bg-white/80" />
          <div className="absolute bottom-0 left-0 h-1 w-8 rounded-full bg-white/80" />
        </div>
        
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 h-16 w-16">
          <div className="absolute bottom-0 right-0 h-8 w-1 rounded-full bg-white/80" />
          <div className="absolute bottom-0 right-0 h-1 w-8 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  )
}
