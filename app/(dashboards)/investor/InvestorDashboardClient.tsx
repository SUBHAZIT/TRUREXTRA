'use client'

import dynamic from "next/dynamic"

// Defer client panels to the client
const PitchDecksPanel = dynamic(() => import("./ui/pitch-decks-panel"), { ssr: false })
const FundingRequestsPanel = dynamic(() => import("./ui/funding-requests-panel"), { ssr: false })

export default function InvestorDashboardClient() {
  return (
    <>
      {/* Pitch Deck Access */}
      <PitchDecksPanel />

      {/* Funding Requests */}
      <FundingRequestsPanel />
    </>
  )
}
