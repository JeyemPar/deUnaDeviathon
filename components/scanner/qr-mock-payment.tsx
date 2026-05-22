"use client"

export function QRMockPayment() {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-lg">
      {/* QR Code SVG - Realistic payment QR pattern */}
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        className="rounded-lg"
      >
        {/* White background */}
        <rect width="180" height="180" fill="white" />
        
        {/* Position Detection Patterns - Top Left */}
        <rect x="10" y="10" width="40" height="40" fill="black" />
        <rect x="15" y="15" width="30" height="30" fill="white" />
        <rect x="20" y="20" width="20" height="20" fill="black" />
        
        {/* Position Detection Patterns - Top Right */}
        <rect x="130" y="10" width="40" height="40" fill="black" />
        <rect x="135" y="15" width="30" height="30" fill="white" />
        <rect x="140" y="20" width="20" height="20" fill="black" />
        
        {/* Position Detection Patterns - Bottom Left */}
        <rect x="10" y="130" width="40" height="40" fill="black" />
        <rect x="15" y="135" width="30" height="30" fill="white" />
        <rect x="20" y="140" width="20" height="20" fill="black" />
        
        {/* Timing Patterns */}
        <rect x="55" y="15" width="5" height="5" fill="black" />
        <rect x="65" y="15" width="5" height="5" fill="black" />
        <rect x="75" y="15" width="5" height="5" fill="black" />
        <rect x="85" y="15" width="5" height="5" fill="black" />
        <rect x="95" y="15" width="5" height="5" fill="black" />
        <rect x="105" y="15" width="5" height="5" fill="black" />
        <rect x="115" y="15" width="5" height="5" fill="black" />
        
        {/* Data Modules - Row patterns */}
        <rect x="60" y="30" width="5" height="5" fill="black" />
        <rect x="70" y="30" width="5" height="5" fill="black" />
        <rect x="85" y="30" width="5" height="5" fill="black" />
        <rect x="100" y="30" width="5" height="5" fill="black" />
        <rect x="110" y="30" width="5" height="5" fill="black" />
        
        <rect x="55" y="40" width="5" height="5" fill="black" />
        <rect x="65" y="40" width="5" height="5" fill="black" />
        <rect x="80" y="40" width="5" height="5" fill="black" />
        <rect x="95" y="40" width="5" height="5" fill="black" />
        <rect x="115" y="40" width="5" height="5" fill="black" />
        
        {/* Central Data Area */}
        <rect x="60" y="55" width="5" height="5" fill="black" />
        <rect x="75" y="55" width="5" height="5" fill="black" />
        <rect x="90" y="55" width="5" height="5" fill="black" />
        <rect x="105" y="55" width="5" height="5" fill="black" />
        <rect x="120" y="55" width="5" height="5" fill="black" />
        
        <rect x="15" y="60" width="5" height="5" fill="black" />
        <rect x="25" y="60" width="5" height="5" fill="black" />
        <rect x="35" y="60" width="5" height="5" fill="black" />
        <rect x="55" y="65" width="5" height="5" fill="black" />
        <rect x="70" y="65" width="5" height="5" fill="black" />
        <rect x="85" y="65" width="5" height="5" fill="black" />
        <rect x="100" y="65" width="5" height="5" fill="black" />
        <rect x="115" y="65" width="5" height="5" fill="black" />
        
        {/* Middle section */}
        <rect x="15" y="75" width="5" height="5" fill="black" />
        <rect x="30" y="75" width="5" height="5" fill="black" />
        <rect x="40" y="75" width="5" height="5" fill="black" />
        <rect x="60" y="75" width="5" height="5" fill="black" />
        <rect x="80" y="75" width="5" height="5" fill="black" />
        <rect x="95" y="75" width="5" height="5" fill="black" />
        <rect x="110" y="75" width="5" height="5" fill="black" />
        <rect x="125" y="75" width="5" height="5" fill="black" />
        <rect x="140" y="75" width="5" height="5" fill="black" />
        <rect x="155" y="75" width="5" height="5" fill="black" />
        
        <rect x="15" y="85" width="5" height="5" fill="black" />
        <rect x="35" y="85" width="5" height="5" fill="black" />
        <rect x="55" y="85" width="5" height="5" fill="black" />
        <rect x="70" y="85" width="5" height="5" fill="black" />
        <rect x="90" y="85" width="5" height="5" fill="black" />
        <rect x="105" y="85" width="5" height="5" fill="black" />
        <rect x="120" y="85" width="5" height="5" fill="black" />
        <rect x="135" y="85" width="5" height="5" fill="black" />
        <rect x="150" y="85" width="5" height="5" fill="black" />
        <rect x="160" y="85" width="5" height="5" fill="black" />
        
        <rect x="20" y="95" width="5" height="5" fill="black" />
        <rect x="40" y="95" width="5" height="5" fill="black" />
        <rect x="60" y="95" width="5" height="5" fill="black" />
        <rect x="75" y="95" width="5" height="5" fill="black" />
        <rect x="85" y="95" width="5" height="5" fill="black" />
        <rect x="100" y="95" width="5" height="5" fill="black" />
        <rect x="115" y="95" width="5" height="5" fill="black" />
        <rect x="130" y="95" width="5" height="5" fill="black" />
        <rect x="145" y="95" width="5" height="5" fill="black" />
        <rect x="155" y="95" width="5" height="5" fill="black" />
        
        {/* Lower section */}
        <rect x="15" y="105" width="5" height="5" fill="black" />
        <rect x="30" y="105" width="5" height="5" fill="black" />
        <rect x="45" y="105" width="5" height="5" fill="black" />
        <rect x="65" y="105" width="5" height="5" fill="black" />
        <rect x="80" y="105" width="5" height="5" fill="black" />
        <rect x="95" y="105" width="5" height="5" fill="black" />
        <rect x="110" y="105" width="5" height="5" fill="black" />
        <rect x="125" y="105" width="5" height="5" fill="black" />
        <rect x="140" y="105" width="5" height="5" fill="black" />
        <rect x="160" y="105" width="5" height="5" fill="black" />
        
        <rect x="25" y="115" width="5" height="5" fill="black" />
        <rect x="40" y="115" width="5" height="5" fill="black" />
        <rect x="55" y="115" width="5" height="5" fill="black" />
        <rect x="70" y="115" width="5" height="5" fill="black" />
        <rect x="85" y="115" width="5" height="5" fill="black" />
        <rect x="100" y="115" width="5" height="5" fill="black" />
        <rect x="115" y="115" width="5" height="5" fill="black" />
        <rect x="130" y="115" width="5" height="5" fill="black" />
        <rect x="145" y="115" width="5" height="5" fill="black" />
        <rect x="155" y="115" width="5" height="5" fill="black" />
        
        {/* Bottom right data */}
        <rect x="60" y="135" width="5" height="5" fill="black" />
        <rect x="75" y="135" width="5" height="5" fill="black" />
        <rect x="90" y="135" width="5" height="5" fill="black" />
        <rect x="105" y="135" width="5" height="5" fill="black" />
        <rect x="120" y="135" width="5" height="5" fill="black" />
        <rect x="135" y="135" width="5" height="5" fill="black" />
        <rect x="150" y="135" width="5" height="5" fill="black" />
        
        <rect x="65" y="145" width="5" height="5" fill="black" />
        <rect x="80" y="145" width="5" height="5" fill="black" />
        <rect x="95" y="145" width="5" height="5" fill="black" />
        <rect x="110" y="145" width="5" height="5" fill="black" />
        <rect x="125" y="145" width="5" height="5" fill="black" />
        <rect x="140" y="145" width="5" height="5" fill="black" />
        <rect x="155" y="145" width="5" height="5" fill="black" />
        
        <rect x="60" y="155" width="5" height="5" fill="black" />
        <rect x="70" y="155" width="5" height="5" fill="black" />
        <rect x="85" y="155" width="5" height="5" fill="black" />
        <rect x="100" y="155" width="5" height="5" fill="black" />
        <rect x="115" y="155" width="5" height="5" fill="black" />
        <rect x="130" y="155" width="5" height="5" fill="black" />
        <rect x="145" y="155" width="5" height="5" fill="black" />
        <rect x="160" y="155" width="5" height="5" fill="black" />
        
        <rect x="65" y="165" width="5" height="5" fill="black" />
        <rect x="75" y="165" width="5" height="5" fill="black" />
        <rect x="90" y="165" width="5" height="5" fill="black" />
        <rect x="105" y="165" width="5" height="5" fill="black" />
        <rect x="120" y="165" width="5" height="5" fill="black" />
        <rect x="135" y="165" width="5" height="5" fill="black" />
        <rect x="150" y="165" width="5" height="5" fill="black" />
      </svg>
      
      {/* Merchant Name */}
      <p className="mt-3 text-center text-xs font-medium text-gray-600">
        Milton Germanico Toaquiza Mendoza
      </p>
    </div>
  )
}
