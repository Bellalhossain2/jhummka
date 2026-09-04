import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Marquee } from "@/components/marquee"
import { Collection } from "@/components/collection"
import { CraftStory } from "@/components/craft-story"
import { Newsletter } from "@/components/newsletter"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Collection />
        <CraftStory />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
