"use client"

import { ChevronLeft, GalleryVerticalEnd } from "lucide-react"
import { useRouter } from "next/navigation"

export function ScannerHeader() {
  const router = useRouter()
  
  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform active:scale-95"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      
      {/* Gallery/Scan Button */}
      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform active:scale-95">
        <GalleryVerticalEnd className="h-5 w-5 text-gray-800" />
      </button>
    </div>
  )
}
