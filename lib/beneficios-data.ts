// Catálogo de beneficios canjeables con ahorro DeVaca.
// Las imágenes se generan en tiempo real con pollinations.ai a partir del
// `imgPrompt` — gratis, sin auth. Si querés otras imágenes, cambiá el prompt
// o reemplazá `imgFor` por una URL estática.

export type CategoriaBeneficio =
  | "Comida"
  | "Entretenimiento"
  | "Compras"
  | "Telco"

export interface Beneficio {
  id: string
  marca: string
  titulo: string
  descripcion: string
  categoria: CategoriaBeneficio
  costo: number // monto en ahorro DeVaca que cuesta canjear
  descuentoPct: number
  color: string // color de marca (para badges y acentos)
  imgPrompt: string
  emoji: string // fallback visual si la imagen falla
}

const POLLINATIONS_OPTS =
  "width=480&height=300&model=flux&nologo=true&enhance=true"

export function imgFor(b: Beneficio): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(b.imgPrompt)}?${POLLINATIONS_OPTS}&seed=${b.id}`
}

export const BENEFICIOS: Beneficio[] = [
  {
    id: "kfc-combo",
    marca: "KFC",
    titulo: "Combo Familiar 30% OFF",
    descripcion: "8 piezas + papas + 2 bebidas",
    categoria: "Comida",
    costo: 5,
    descuentoPct: 30,
    color: "#E4002B",
    emoji: "🍗",
    imgPrompt:
      "Crispy golden fried chicken bucket with french fries and soda, hyper detailed product photography, red and white branded background, studio lighting, appetizing food photo",
  },
  {
    id: "pizza-hut-2x1",
    marca: "Pizza Hut",
    titulo: "2x1 en pizzas medianas",
    descripcion: "Pepperoni, suprema o hawaiana",
    categoria: "Comida",
    costo: 4,
    descuentoPct: 50,
    color: "#D2232C",
    emoji: "🍕",
    imgPrompt:
      "Delicious melted cheese pizza with pepperoni, hot fresh out of the oven, top down product photography, dark wooden table, warm cinematic lighting",
  },
  {
    id: "cinemark",
    marca: "Cinemark",
    titulo: "50% OFF entradas 2D",
    descripcion: "Cualquier película, lunes a jueves",
    categoria: "Entretenimiento",
    costo: 3,
    descuentoPct: 50,
    color: "#F2A900",
    emoji: "🎬",
    imgPrompt:
      "Cinema popcorn bucket and movie tickets, red velvet curtains background, cinematic dramatic lighting, premium product photography",
  },
  {
    id: "marathon",
    marca: "Marathon Sports",
    titulo: "$10 OFF en zapatillas",
    descripcion: "Compra mínima $50",
    categoria: "Compras",
    costo: 8,
    descuentoPct: 20,
    color: "#0066B3",
    emoji: "👟",
    imgPrompt:
      "Modern athletic running sneakers, clean white studio background, premium product photography, sporty vibrant colors",
  },
  {
    id: "movistar-recarga",
    marca: "Movistar",
    titulo: "Recarga 2x1",
    descripcion: "Duplica tu saldo al instante",
    categoria: "Telco",
    costo: 2,
    descuentoPct: 100,
    color: "#019DF4",
    emoji: "📱",
    imgPrompt:
      "Modern smartphone with vibrant signal waves, blue gradient background, product photography, tech style",
  },
  {
    id: "netflix-mes",
    marca: "Netflix",
    titulo: "1 mes gratis Premium",
    descripcion: "Para nuevos suscriptores",
    categoria: "Entretenimiento",
    costo: 7,
    descuentoPct: 100,
    color: "#E50914",
    emoji: "📺",
    imgPrompt:
      "Cozy modern living room at night with large TV screen glowing, popcorn and remote on couch, cinematic warm lighting, dark moody atmosphere",
  },
  {
    id: "starbucks-frappe",
    marca: "Starbucks",
    titulo: "25% OFF frappuccinos",
    descripcion: "Cualquier tamaño, todos los días",
    categoria: "Comida",
    costo: 2,
    descuentoPct: 25,
    color: "#00704A",
    emoji: "☕",
    imgPrompt:
      "Cold frappuccino coffee drink with whipped cream and caramel drizzle, premium product photography, green branded background, refreshing",
  },
  {
    id: "supermaxi-5",
    marca: "Supermaxi",
    titulo: "$5 OFF en supermercado",
    descripcion: "En compras de $30 o más",
    categoria: "Compras",
    costo: 4,
    descuentoPct: 17,
    color: "#E30613",
    emoji: "🛒",
    imgPrompt:
      "Shopping cart full of fresh colorful groceries and produce, modern supermarket aisle, bright clean lighting, lifestyle photography",
  },
]

export const CATEGORIAS: { id: CategoriaBeneficio | "Todos"; label: string }[] =
  [
    { id: "Todos", label: "Todos" },
    { id: "Comida", label: "Comida" },
    { id: "Entretenimiento", label: "Entretenimiento" },
    { id: "Compras", label: "Compras" },
    { id: "Telco", label: "Telco" },
  ]
