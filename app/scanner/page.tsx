"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ScannerHeader } from "@/components/scanner/scanner-header"
import { ScannerFrame } from "@/components/scanner/scanner-frame"
import { InstructionText } from "@/components/scanner/instruction-text"
import { PaymentCodeButton } from "@/components/scanner/payment-code-button"
import { ScanResultModal } from "@/components/scanner/scan-result-modal"

export default function ScannerPage() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText)
    setShowResult(true)
  }

  const handleCloseResult = () => {
    setShowResult(false)
    setScanResult(null)
  }

  const handleConfirmPayment = () => {
    // Here you would handle the payment logic
    setShowResult(false)
    router.push("/")
  }

  return (
    <div className="relative mx-auto flex h-screen max-w-md flex-col overflow-hidden bg-black">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Status Bar Spacer */}
        <div className="h-8" />
        
        {/* Header */}
        <ScannerHeader />
        
        {/* Scanner Area */}
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <ScannerFrame onScanSuccess={handleScanSuccess} />
          
          {/* Instruction Text */}
          <div className="mt-8">
            <InstructionText />
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pb-8 pt-4">
          <PaymentCodeButton />
          
          {/* Home Indicator */}
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-32 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Scan Result Modal */}
      <ScanResultModal 
        isOpen={showResult}
        result={scanResult}
        onClose={handleCloseResult}
        onConfirm={handleConfirmPayment}
      />
    </div>
  )
}
