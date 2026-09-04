const COLUMNS = [
  {
    title: "Shop",
    links: ["Jhumkas", "Necklaces", "Bangles", "Bridal Sets", "Gift Cards"],
  },
  {
    title: "Atelier",
    links: ["Our Heritage", "The Karigars", "Bespoke Orders", "Journal"],
  },
  {
    title: "Care",
    links: ["Shipping & Returns", "Lifetime Buyback", "Jewellery Care", "Contact"],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-serif text-3xl font-semibold tracking-[0.2em] text-gold">
              JHUMMKA
            </span>
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              Handcrafted gold heritage jewellery from Jaipur. Worn today,
              treasured forever.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-foreground">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-gold"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jhummka Fine Gold Atelier. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#" className="transition-colors hover:text-gold">
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-gold">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-gold">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
