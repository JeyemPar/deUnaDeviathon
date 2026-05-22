import { Header } from "@/components/banking/header"
import { BalanceCard } from "@/components/banking/balance-card"
import { PromoCarousel } from "@/components/banking/promo-carousel"
import { QuickActionsGrid } from "@/components/banking/quick-actions-grid"
import { BeneficiosPreview } from "@/components/beneficios/beneficios-preview"
import { QRButton } from "@/components/banking/qr-button"
import { BottomNavigation } from "@/components/banking/bottom-navigation"

export default function BankingHome() {
  return (
    <div className="mobile-container">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <Header />
        <BalanceCard />
        <PromoCarousel />
        <BeneficiosPreview />
        <QuickActionsGrid />
      </div>

      {/* Fixed Bottom Section */}
      <div className="shrink-0">
        <QRButton />
        <BottomNavigation />
      </div>
    </div>
  )
}
