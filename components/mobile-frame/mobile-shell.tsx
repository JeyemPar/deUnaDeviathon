"use client"

import { ReactNode } from "react"

interface MobileShellProps {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="mobile-viewport-wrapper">
      {/* Background gradient behind the phone */}
      <div className="mobile-bg" />

      {/* Phone device frame */}
      <div className="mobile-device">
        {/* Notch */}
        <div className="mobile-notch">
          <div className="mobile-notch-camera" />
        </div>

        {/* App content */}
        <div className="mobile-screen">
          {children}
        </div>

        {/* Home indicator */}
        <div className="mobile-home-indicator-bar">
          <div className="mobile-home-indicator" />
        </div>
      </div>
    </div>
  )
}
