export type Product = {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  span?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: "rani-jhumka",
    name: "Rani Jhumka",
    category: "Classic",
    price: 320,
    image: "/jhumka-1.png",
    description: "Bell-domed jhumkas with hand-drawn filigree and a whisper-fine gold bead fringe.",
    span: true,
  },
  {
    id: "moti-jhumka",
    name: "Moti Pearl Jhumka",
    category: "Bridal",
    price: 380,
    image: "/jhumka-2.png",
    description: "Floral filigree crowns cascading into a fringe of freshwater pearl droplets.",
  },
  {
    id: "manik-jhumka",
    name: "Manik Ruby Jhumka",
    category: "Temple",
    price: 450,
    image: "/jhumka-3.png",
    description: "Temple-style jhumkas set with deep red rubies and antique gold detailing.",
  },
  {
    id: "zamrud-jhumka",
    name: "Zamrud Emerald Jhumka",
    category: "Temple",
    price: 420,
    image: "/jhumka-4.png",
    description: "Peacock-motif jhumkas accented with emerald green stones and fine engraving.",
  },
  {
    id: "chandbali-jhumka",
    name: "Chandbali Jhumka",
    category: "Statement",
    price: 410,
    image: "/jhumka-5.png",
    description: "Grand crescent chandbali with layered gold bead fringe for the boldest occasions.",
    span: true,
  },
  {
    id: "nazuk-jhumka",
    name: "Nazuk Everyday Jhumka",
    category: "Minimal",
    price: 180,
    image: "/jhumka-6.png",
    description: "Petite bell studs with subtle filigree — heritage worn lightly, every day.",
  },
]

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}
