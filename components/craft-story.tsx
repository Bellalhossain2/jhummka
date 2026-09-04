import Image from "next/image"

const STATS = [
  { value: "75+", label: "Years of legacy" },
  { value: "42", label: "Master karigars" },
  { value: "22K", label: "Certified gold" },
]

export function CraftStory() {
  return (
    <section id="craft" className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[420px] lg:min-h-[640px]">
          <Image
            src="/craft.png"
            alt="A master goldsmith crafting intricate gold jewellery by hand"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/40 lg:to-secondary/40" />
        </div>

        <div className="flex flex-col justify-center px-5 py-16 md:px-14 md:py-24">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
            <span className="h-px w-8 bg-gold" />
            The Atelier
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-tight text-foreground md:text-5xl">
            Shaped by hand, guarded by generations
          </h2>
          <p className="mt-6 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            In our Jaipur workshop, every jhumka begins as a whisper of molten
            gold. Our karigars — many the third in their line — coax it into
            filigree so fine it seems to breathe. No mould, no machine, only
            patience and a memory of technique passed down across decades.
          </p>
          <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            The result is jewellery that isn&apos;t bought so much as inherited.
          </p>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-4xl text-gold md:text-5xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
