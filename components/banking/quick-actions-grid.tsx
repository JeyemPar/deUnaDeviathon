"use client"

import {
  Banknote,
  Building2,
  Wallet,
  CreditCard,
  MapPin,
  Smartphone,
  FileText,
  Train,
} from "lucide-react"

const actions = [
  {
    id: 1,
    label: "Transferir",
    icon: Banknote,
    color: "#22C55E",
    bgColor: "#F0FDF4",
  },
  {
    id: 2,
    label: "Transferir a otro banco",
    icon: Building2,
    color: "#5B2393",
    bgColor: "#EDE3F8",
  },
  {
    id: 3,
    label: "Recargar",
    icon: Wallet,
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
  {
    id: 4,
    label: "Cobrar",
    icon: CreditCard,
    color: "#22C55E",
    bgColor: "#F0FDF4",
  },
  {
    id: 5,
    label: "Retirar",
    icon: MapPin,
    color: "#22C55E",
    bgColor: "#F0FDF4",
    badge: "Veci",
  },
  {
    id: 6,
    label: "Recarga celular",
    icon: Smartphone,
    color: "#F97316",
    bgColor: "#FFF7ED",
  },
  {
    id: 7,
    label: "Pagar servicios",
    icon: FileText,
    color: "#8FE8C9",
    bgColor: "#F0FDF9",
  },
  {
    id: 8,
    label: "Metro de Quito",
    icon: Train,
    color: "#5B2393",
    bgColor: "#EDE3F8",
  },
]

export function QuickActionsGrid() {
  return (
    <div className="mt-4 px-4">
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
            >
              {action.badge && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 rounded bg-[#22C55E] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {action.badge}
                </div>
              )}
              <action.icon
                className="h-7 w-7"
                style={{ color: action.color }}
              />
            </div>
            <span className="text-center text-xs leading-tight text-foreground">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
