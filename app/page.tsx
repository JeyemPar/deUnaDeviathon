import { Header } from "@/components/banking/header"
import { BalanceCard } from "@/components/banking/balance-card"
import { PromoCarousel } from "@/components/banking/promo-carousel"
import { QuickActionsGrid } from "@/components/banking/quick-actions-grid"
import { QRButton } from "@/components/banking/qr-button"
import { BottomNavigation } from "@/components/banking/bottom-navigation"

export default function BankingHome() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      {/* Status Bar Spacer */}
      <div className="h-6 bg-white" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <Header />
        <BalanceCard />
        <PromoCarousel />
        <QuickActionsGrid />
      </div>

      {/* Fixed Bottom Section */}
      <div className="sticky bottom-0 bg-white">
        <QRButton />
        <BottomNavigation />
        {/* Home Indicator */}
        <div className="flex justify-center pb-2">
          <div className="h-1 w-32 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
