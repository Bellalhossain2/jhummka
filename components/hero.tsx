import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <Image
        src="/hero-model.png"
        alt="Model wearing ornate gold jhumka earrings"
        fill
        priority
        className="object-cover object-center md:object-[50%_25%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:pb-0">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
            <span className="h-px w-8 bg-gold" />
            Est. Heritage 1948
          </p>
          <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl lg:text-8xl">
            Gold that
            <br />
            <span className="italic text-gold">remembers</span> her
          </h1>
          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Hand-forged jhumkas, temple necklaces and bridal heirlooms. Each piece carries the quiet weight of tradition, made to be worn for generations.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="/#collection" className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-xs uppercase tracking-widest text-black">
              Explore Collection <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="/#craft" className="inline-flex items-center border border-foreground/20 px-6 py-3 text-xs uppercase tracking-widest">
              Our Craft
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
