"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader")
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            onScanSuccess(decodedText)
          },
          (errorMessage) => {
            // Ignore frequent scan errors (no QR found)
          }
        )
        setIsScanning(true)
        setHasPermission(true)
      } catch (err) {
        console.error("Error starting scanner:", err)
        setHasPermission(false)
        onScanError?.("No se pudo acceder a la camara")
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [onScanSuccess, onScanError])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[36px]">
      <div 
        id="qr-reader" 
        className="h-full w-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover [&>video]:rounded-[36px]"
        style={{
          // Hide the default UI elements from html5-qrcode
        }}
      />
      
      {/* Scanning line animation */}
      {isScanning && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]">
          <div 
            className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan"
          />
        </div>
      )}

      {/* Permission denied message */}
      {hasPermission === false && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-[36px]">
          <div className="text-center px-4">
            <p className="text-white text-sm">
              Permite el acceso a la camara para escanear codigos QR
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {hasPermission === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[36px]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 10%;
          }
          50% {
            top: 90%;
          }
          100% {
            top: 10%;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
