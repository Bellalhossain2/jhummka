import { ArrowRight } from "lucide-react"

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="relative overflow-hidden border border-gold/25 bg-card px-6 py-16 text-center md:px-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">
          The Inner Circle
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl text-balance font-serif text-3xl font-light leading-tight text-foreground md:text-5xl">
          Be the first to see each new collection
        </h2>
        <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Private previews, atelier stories and an invitation to our seasonal
          trunk shows. No noise, only gold.
        </p>

        <form className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Your email address"
            className="h-13 flex-1 border border-border bg-background px-5 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
          />
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-gold-muted"
          >
            Subscribe
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>
    </section>
  )
}
