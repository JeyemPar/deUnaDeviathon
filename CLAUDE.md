# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Contexto del proyecto

Prototipo de interfaz de usuario bancaria "mobile-first" ("deuna - Banca Digital") en español. Iniciado con v0 y enlazado a un proyecto de v0 (`prj_VIcS6Iyu9U7U4mULmsLWtOQkL9bH`) — **las ediciones realizadas en v0 hacen "push" de los commits directamente a este repositorio, y cada "merge" a `main` se despliega automáticamente**. Ten esto en cuenta: un colaborador humano puede sobrescribir cambios manuales a través de v0, y viceversa.

Los textos de la interfaz de usuario (UI) están en español; preserva el idioma al editar cadenas de texto dirigidas al usuario. El producto DeVaca se menciona en los textos como **"dVaca"** (sin la primera "e"); mantén la consistencia en la ortografía de la marca.

## Comandos

El gestor de paquetes es **pnpm** (ver `pnpm-lock.yaml`).

```bash
pnpm dev      # next dev — http://localhost:3000
pnpm build    # next build
pnpm start    # servidor de producción
pnpm lint     # eslint .
```

No hay ningún framework de pruebas configurado.

## Arquitectura

**Next.js 16 App Router + React 19 + Tailwind v4 + shadcn/ui** (estilo: `new-york`, color base: `neutral`, iconos: `lucide-react`). El alias de ruta `@/*` apunta a la raíz del repositorio.

### Rutas

| Ruta | Propósito |
|---|---|
| `/` | Inicio bancario (saldo, tarjeta DeVaca, carrusel de insights, vista previa de beneficios, acciones rápidas, botón QR) |
| `/devaca` | Panel de control de DeVaca — 4 pestañas: Resumen, Pagar, Canjear, Configurar |
| `/devaca/pago` | Pantalla de detalle de pago (se accede mediante la query `?mipyme=...&monto=...`) |
| `/scanner` | Escáner QR (actualmente simulado - mock) |
| `/scanner/devaca` | Escáner QR específico para el flujo de pago de DeVaca |
| `/beneficios` | Catálogo de cupones canjeables, filtrables por categoría, con "bottom-sheet" de detalle |

La navegación inferior (`components/banking/bottom-navigation.tsx`) es el único elemento persistente de la interfaz (chrome) y se renderiza dentro de cada página que lo necesita (no en el layout principal). La pestaña activa se deriva de `usePathname()`.

### Patrón de composición de páginas

Las rutas bajo `app/` son contenedores delgados (thin shells) que componen componentes de características (feature components) — solo poseen diseño/estructura, no comportamiento. Al añadir una pantalla, sigue esta división: página = composición + layout, componentes de características en `components/<característica>/`.

### Capas de componentes

- `components/banking/` — widgets de características de la pantalla de inicio (Header, BalanceCard, PromoCarousel, QuickActionsGrid, QRButton, BottomNavigation).
- `components/beneficios/` — UI de cupones (actualmente `beneficios-preview.tsx` para la franja de inicio; la cuadrícula completa de `/beneficios` vive en línea en `app/beneficios/page.tsx`).
- `components/scanner/` — UI del escáner QR. El escaneo de cámara real vive en `qr-scanner.tsx` usando `html5-qrcode`; la página actual de escáner usa un mock estático (`qr-mock-payment.tsx`), por lo que el escáner real está cableado pero inactivo en la ruta.
- `components/mobile-frame/` — Interfaz (chrome) con forma de teléfono (`MobileShell`, `StatusBar`) para previsualizar la aplicación dentro del marco de un dispositivo en escritorio. Actualmente no lo utiliza `app/layout.tsx` — el layout principal renderiza el contenido a pantalla completa (fullscreen).
- `components/ui/` — primitivas de shadcn/ui. Añade nuevas primitivas a través de la CLI de shadcn en lugar de hacerlas a mano.

### Gestión de estado — DeVaca store

`lib/devaca-store.tsx` es la **única fuente de verdad** para el producto de ahorros DeVaca. Utiliza React Context + `useReducer`. El proveedor (provider) se monta **una vez** en `app/layout.tsx` y envuelve todo el árbol — **no** añadas un segundo `<DeVacaProvider>` en un layout anidado (un error anterior: los proveedores anidados causaban aislamiento de estado al navegar entre `/devaca` y `/devaca/pago`).

Los consumidores llaman a `useDeVaca()` para leer el estado y despachar acciones (dispatch):

- **Estado (State)**: `saldoPrincipal`, `ahorroAcumulado`, `niveles[]`, `transacciones[]`, `mipymes[]`, `metaSeleccionadaIndex` (null = elegir automáticamente el primer nivel no alcanzado).
- **Acciones** (expuestas como funciones callback): `pagarConAhorro`, `pagarSinAhorro`, `canjearAhorro`, `actualizarNivel`, `actualizarSaldoPrincipal`, `restaurarNiveles`, `seleccionarMeta`.
- **Ayudante (Helper)**: `getMetaActivaIndex(state)` — úsalo para calcular la meta activa del usuario en todas partes (tanto `/devaca` como el `BalanceCard` de inicio dependen de él).

El almacén (store) está solo en memoria; nada persiste tras las recargas.

### Catálogo de Beneficios

`lib/beneficios-data.ts` define `BENEFICIOS: Beneficio[]` y las categorías. **Las imágenes generadas por IA** provienen de `pollinations.ai` a través del helper `imgFor(b)` — codifica en URL `b.imgPrompt` y añade un `seed=<id>` estable para que cada cupón devuelva siempre la misma imagen. La primera carga puede tomar de 5 a 15 segundos; las cargas subsiguientes están cacheadas. Mantén los prompts cortos (5-8 palabras) — los prompts largos se encolan y a menudo agotan el tiempo de espera (time out).

**Patrón de reserva de imagen (fallback pattern)** (usado tanto en la vista previa de inicio como en la cuadrícula completa): cada contenedor de imagen tiene un fondo degradado con los colores de la marca + el campo `emoji` renderizado en el centro con sombra. El `<img>` se superpone `absolute inset-0` en la parte superior con un `onError` que lo oculta. Si pollinations falla o es lento, el degradado de la marca + emoji permanece visible — nunca una caja gris vacía.

### Convenciones de estilo de la aplicación móvil

`app/globals.css` no son solo tokens de tema — define el **contenedor de la aplicación móvil (mobile app shell)**:

- `html, body` están bloqueados en `height: 100%; overflow: hidden; overscroll-behavior: none; user-select: none` para sentirse nativos. No agregues scroll a nivel de página; haz scroll dentro de las regiones `.overflow-y-auto`.
- `.mobile-container` (`flex flex-col`, `height: 100dvh`) es el contenedor raíz utilizado por todas las páginas. Úsalo para nuevas pantallas.
- `.scrollbar-hide` para regiones de scroll que no deben mostrar una barra de desplazamiento.
- El tema utiliza variables CSS OKLCH conectadas a través del bloque `@theme inline` de Tailwind v4.
- **Paleta de la marca** (usada directamente en componentes, no como tokens de Tailwind):
  - Morado principal: `#5B2393` (marca deuna)
  - DeVaca verde: `#00DDA6`, suave `rgba(0, 221, 166, 0.15)`
  - DeVaca morado: `#432959`, suave `rgba(67, 41, 89, 0.10)`
- Usa `cn()` de `lib/utils.ts` (`clsx` + `tailwind-merge`) para la composición condicional de clases.
- Los fotogramas clave personalizados (Custom keyframes) (`devaca-pulse`, `scan-line`) viven en `globals.css`, **no** en bloques `<style jsx>` — ver Peculiaridades de Construcción/Tiempo de ejecución abajo.

### Peculiaridades de Construcción/Tiempo de ejecución (Build/runtime quirks)

- `next.config.mjs` establece `typescript.ignoreBuildErrors: true` y `images.unoptimized: true` — Los errores de TS **no** bloquean `pnpm build`. Ejecuta `tsc --noEmit` (o confía en el editor) para hacer aflorar los errores de tipo. No dependas de `next build` como comprobador de tipos. Debido a que `images.unoptimized` es true, las etiquetas `<img>` regulares con cualquier URL externa funcionan (usado para pollinations.ai).
- **No uses bloques `<style jsx>`.** Turbopack en Next 16 + React 19 cuelga la compilación de `/devaca` silenciosamente cuando un componente del cliente tiene `<style jsx>` con interpolación de plantillas literales (`${VAR}`). Síntoma: aparece `○ Compiling /devaca ...` en dev.log y nunca se completa; el navegador se queda en la pantalla de carga de Next eternamente. Pon los keyframes / estilos compartidos en `globals.css` en su lugar.
- **HMR solo funciona a través de `http://localhost:3000`.** Si abres la URL de desarrollo a través de la IP de Tailscale / LAN (ej. `http://100.x.x.x:3000`), el WebSocket intenta alcanzar el endpoint HMR en el mismo host y falla en un bucle de reconexión, inundando la consola con `WebSocket connection to 'ws://.../_next/webpack-hmr' failed`.
- **Cuidado con los procesos `node` zombies.** Múltiples ejecuciones fallidas de `pnpm dev` dejan procesos de node vivos en Windows — no mueren automáticamente cuando se cierra el terminal principal. `Get-Process node` los enumera; uno con miles de segundos de CPU es el servidor de desarrollo atascado en compilación. `Stop-Process -Name node -Force` los limpia (pero también mata a los ayudantes de node de VS Code / Cursor — ciérralos primero).
- `app/layout.tsx` solo monta `@vercel/analytics` en producción (`NODE_ENV === 'production'`).
- HTML raíz `lang="es"`; viewport fijado (`maximumScale: 1, userScalable: false`) — intencional para la sensación de aplicación móvil.
- Los archivos en tiempo de ejecución de v0 (`__v0_*`) están en gitignore — déjalos en paz si aparecen localmente.
