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
        className="object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-0">
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
            Hand-forged jhumkas, temple necklaces and bridal heirlooms. Each
            piece carries the quiet weight of tradition, made to be worn for
            generations.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#collection"
              className="group inline-flex items-center justify-center gap-2 bg-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold-muted"
            >
              Explore Collection
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#craft"
              className="inline-flex items-center justify-center border border-border px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Our Craft
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
