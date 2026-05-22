"use client"

import { ScannerHeader } from "@/components/scanner/scanner-header"
import { ScannerFrame } from "@/components/scanner/scanner-frame"
import { InstructionText } from "@/components/scanner/instruction-text"
import { PaymentCodeButton } from "@/components/scanner/payment-code-button"

export default function ScannerPage() {
  return (
    <div className="mobile-container relative bg-black">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <ScannerHeader />

        {/* Scanner Area */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <ScannerFrame />
          <div className="mt-8">
            <InstructionText />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="shrink-0 pb-6 pt-4">
          <PaymentCodeButton />
        </div>
      </div>
    </div>
  )
}
