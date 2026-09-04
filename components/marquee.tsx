const ITEMS = [
  "22K Certified Gold",
  "Handcrafted by Master Karigars",
  "Lifetime Buyback",
  "Free Insured Shipping",
  "BIS Hallmarked",
]

export function Marquee() {
  return (
    <div className="border-y border-border/60 bg-secondary/40 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 md:px-8">
        {ITEMS.map((item) => (
          <span
            key={item}
            className="flex items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            {item}
            <span className="hidden size-1 rounded-full bg-gold md:inline-block" />
          </span>
        ))}
      </div>
    </div>
  )
}
