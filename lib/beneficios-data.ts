// Catálogo de beneficios canjeables con ahorro DeVaca.
// Las imágenes se generan en tiempo real con pollinations.ai a partir del
// `imgPrompt` — gratis, sin auth. Si querés otras imágenes, cambiá el prompt
// o reemplazá `imgFor` por una URL estática.
//
// SEGMENTACIÓN — Economía circular DeVaca:
//   - "MiPymes": negocios locales donde el usuario genera el ahorro al pagar
//     con Ahorro Sugerido. Cupones más baratos para incentivar que el dinero
//     vuelva a la red local (el ciclo cierra acá).
//   - "Comercios": cadenas / grandes marcas. Aspiracional, costos medios-altos.
//   - "Cupones": servicios universales para todas las edades (transporte,
//     salud, educación, ocio, familias).

export type CategoriaBeneficio = "Comercios" | "MiPymes" | "Cupones"

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

const POLLINATIONS_OPTS = "width=480&height=300&nologo=true"

export function imgFor(b: Beneficio): string {
  // seed estable por id → la misma imagen para el mismo cupón entre cargas.
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(b.imgPrompt)}?${POLLINATIONS_OPTS}&seed=${b.id}`
}

export const BENEFICIOS: Beneficio[] = [
  // ─────────────────── MiPymes — donde se cierra el ciclo ────────────────
  {
    id: "mipyme-don-carlos",
    marca: "Tienda Don Carlos",
    titulo: "10% OFF en abarrotes",
    descripcion: "En compras de $5 o más, todos los días",
    categoria: "MiPymes",
    costo: 1.5,
    descuentoPct: 10,
    color: "#16A34A",
    emoji: "🏪",
    imgPrompt: "small neighborhood grocery store warm lighting shelves",
  },
  {
    id: "mipyme-la-esquina",
    marca: "Comedor La Esquina",
    titulo: "Almuerzo + jugo gratis",
    descripcion: "Al pedir el segundo almuerzo",
    categoria: "MiPymes",
    costo: 2,
    descuentoPct: 30,
    color: "#EA580C",
    emoji: "🍲",
    imgPrompt: "homemade ecuadorian lunch plate rice meat soup",
  },
  {
    id: "mipyme-el-pana",
    marca: "Minimarket El Pana",
    titulo: "Pan + leche gratis",
    descripcion: "Combo desayuno en compras +$8",
    categoria: "MiPymes",
    costo: 2,
    descuentoPct: 25,
    color: "#0EA5E9",
    emoji: "🥖",
    imgPrompt: "fresh bread basket and milk bottle minimarket counter",
  },
  {
    id: "mipyme-papeleria",
    marca: "Papelería Central",
    titulo: "20% OFF útiles escolares",
    descripcion: "Cuadernos, lápices y mochilas",
    categoria: "MiPymes",
    costo: 2,
    descuentoPct: 20,
    color: "#7C3AED",
    emoji: "✏️",
    imgPrompt: "colorful school supplies notebooks pencils backpack",
  },
  {
    id: "mipyme-barberia",
    marca: "Barbería del Barrio",
    titulo: "Corte clásico $5",
    descripcion: "Precio especial socios DeVaca",
    categoria: "MiPymes",
    costo: 3,
    descuentoPct: 30,
    color: "#374151",
    emoji: "💈",
    imgPrompt: "classic barbershop chair scissors vintage style",
  },
  {
    id: "mipyme-panaderia",
    marca: "Panadería La Espiga",
    titulo: "Docena de pan caliente",
    descripcion: "Recién horneado, todas las mañanas",
    categoria: "MiPymes",
    costo: 1.5,
    descuentoPct: 40,
    color: "#D97706",
    emoji: "🥐",
    imgPrompt: "fresh hot golden bread bakery warm display",
  },

  // ─────────────────── Comercios — cadenas y marcas grandes ──────────────
  {
    id: "kfc-combo",
    marca: "KFC",
    titulo: "Combo Familiar 30% OFF",
    descripcion: "8 piezas + papas + 2 bebidas",
    categoria: "Comercios",
    costo: 5,
    descuentoPct: 30,
    color: "#E4002B",
    emoji: "🍗",
    imgPrompt: "fried chicken bucket food photography red background",
  },
  {
    id: "pizza-hut-2x1",
    marca: "Pizza Hut",
    titulo: "2x1 en pizzas medianas",
    descripcion: "Pepperoni, suprema o hawaiana",
    categoria: "Comercios",
    costo: 4,
    descuentoPct: 50,
    color: "#D2232C",
    emoji: "🍕",
    imgPrompt: "pepperoni pizza top down food photography",
  },
  {
    id: "cinemark",
    marca: "Cinemark",
    titulo: "50% OFF entradas 2D",
    descripcion: "Cualquier película, lunes a jueves",
    categoria: "Comercios",
    costo: 3,
    descuentoPct: 50,
    color: "#F2A900",
    emoji: "🎬",
    imgPrompt: "cinema popcorn bucket red curtain movie theater",
  },
  {
    id: "marathon",
    marca: "Marathon Sports",
    titulo: "$10 OFF en zapatillas",
    descripcion: "Compra mínima $50",
    categoria: "Comercios",
    costo: 8,
    descuentoPct: 20,
    color: "#0066B3",
    emoji: "👟",
    imgPrompt: "modern running sneakers white background product photo",
  },
  {
    id: "netflix-mes",
    marca: "Netflix",
    titulo: "1 mes gratis Premium",
    descripcion: "Para nuevos suscriptores",
    categoria: "Comercios",
    costo: 7,
    descuentoPct: 100,
    color: "#E50914",
    emoji: "📺",
    imgPrompt: "cozy living room tv streaming dark warm",
  },
  {
    id: "starbucks-frappe",
    marca: "Starbucks",
    titulo: "25% OFF frappuccinos",
    descripcion: "Cualquier tamaño, todos los días",
    categoria: "Comercios",
    costo: 2,
    descuentoPct: 25,
    color: "#00704A",
    emoji: "☕",
    imgPrompt: "iced frappuccino coffee whipped cream green background",
  },
  {
    id: "movistar-recarga",
    marca: "Movistar",
    titulo: "Recarga 2x1",
    descripcion: "Duplica tu saldo al instante",
    categoria: "Comercios",
    costo: 2,
    descuentoPct: 100,
    color: "#019DF4",
    emoji: "📱",
    imgPrompt: "smartphone signal waves blue gradient tech",
  },
  {
    id: "supermaxi-5",
    marca: "Supermaxi",
    titulo: "$5 OFF en supermercado",
    descripcion: "En compras de $30 o más",
    categoria: "Comercios",
    costo: 4,
    descuentoPct: 17,
    color: "#E30613",
    emoji: "🛒",
    imgPrompt: "shopping cart fresh groceries supermarket aisle",
  },

  // ─────────────────── Cupones — servicios para todas las edades ─────────
  {
    id: "cupon-metro-quito",
    marca: "Metro de Quito",
    titulo: "5 viajes gratis",
    descripcion: "Cualquier estación de la línea 1",
    categoria: "Cupones",
    costo: 3,
    descuentoPct: 100,
    color: "#003DA5",
    emoji: "🚇",
    imgPrompt: "modern subway metro train station bright clean",
  },
  {
    id: "cupon-fybeca",
    marca: "Farmacia Fybeca",
    titulo: "20% OFF medicamentos",
    descripcion: "Especial adultos mayores",
    categoria: "Cupones",
    costo: 4,
    descuentoPct: 20,
    color: "#E11D48",
    emoji: "💊",
    imgPrompt: "pharmacy shelves medicine clean modern wellness",
  },
  {
    id: "cupon-mundo-aventura",
    marca: "Mundo Aventura",
    titulo: "Entrada familiar 50% OFF",
    descripcion: "Parque de diversiones, fines de semana",
    categoria: "Cupones",
    costo: 5,
    descuentoPct: 50,
    color: "#9333EA",
    emoji: "🎢",
    imgPrompt: "amusement park roller coaster sunny family fun",
  },
  {
    id: "cupon-coursera",
    marca: "Coursera",
    titulo: "1 mes Plus gratis",
    descripcion: "Acceso a 7000+ cursos online",
    categoria: "Cupones",
    costo: 4,
    descuentoPct: 100,
    color: "#0056D2",
    emoji: "📚",
    imgPrompt: "online learning laptop student studying books",
  },
  {
    id: "cupon-cabify",
    marca: "Cabify",
    titulo: "$5 OFF tu próximo viaje",
    descripcion: "Aplica en cualquier categoría",
    categoria: "Cupones",
    costo: 3,
    descuentoPct: 40,
    color: "#7C2DBC",
    emoji: "🚗",
    imgPrompt: "modern rideshare car interior city night",
  },
  {
    id: "cupon-mr-books",
    marca: "Mr. Books",
    titulo: "30% OFF libros infantiles",
    descripcion: "Fomenta la lectura en familia",
    categoria: "Cupones",
    costo: 2,
    descuentoPct: 30,
    color: "#0F766E",
    emoji: "📖",
    imgPrompt: "colorful children books shelf cozy library",
  },
]

export const CATEGORIAS: { id: CategoriaBeneficio | "Todos"; label: string }[] =
  [
    { id: "Todos", label: "Todos" },
    { id: "MiPymes", label: "MiPymes" },
    { id: "Comercios", label: "Comercios" },
    { id: "Cupones", label: "Cupones" },
  ]

export const SEGMENTOS: {
  id: CategoriaBeneficio
  titulo: string
  descripcion: string
  icono: string
}[] = [
  {
    id: "MiPymes",
    titulo: "MiPymes locales",
    descripcion: "Donde tu ahorro vuelve a la red que lo generó",
    icono: "🏪",
  },
  {
    id: "Comercios",
    titulo: "Comercios",
    descripcion: "Cadenas y marcas grandes",
    icono: "🛍️",
  },
  {
    id: "Cupones",
    titulo: "Cupones para todos",
    descripcion: "Transporte, salud, educación y ocio",
    icono: "🎫",
  },
]
