import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutClient } from "@/components/checkout-client"

export const metadata: Metadata = {
  title: "Checkout — Jhummka",
  description: "Complete your Jhummka order.",
}

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
        <CheckoutClient />
      </main>
      <SiteFooter />
    </>
  )
}
