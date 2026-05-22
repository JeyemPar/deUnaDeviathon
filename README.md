# deUnaDeviathon — dVaca (Banca Digital Mobile-First)

Este repositorio contiene la implementación del prototipo interactivo de banca digital "mobile-first" para la plataforma **deuna**, integrado con el módulo de ahorro inteligente **dVaca** y un catálogo dinámico de beneficios. El sistema está estructurado bajo una arquitectura moderna orientada a la modularidad, rendimiento visual y consistencia de estado en memoria.

---

## 1. Pila Tecnológica (Tech Stack)

La infraestructura de software del proyecto se basa en las siguientes tecnologías principales:

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) para el enrutamiento híbrido, optimización de bundles y renderizado del lado del servidor (SSR) y del cliente (CSR).
*   **Biblioteca de UI**: [React 19](https://react.dev/) aprovechando las últimas mejoras en concurrencia y hooks nativos (`useReducer`, `useCallback`, `useContext`).
*   **Estilización (Styling)**: [Tailwind CSS v4](https://tailwindcss.com/) configurado a través del bloque `@theme` mediante variables cromáticas en formato OKLCH para una paleta dinámica y de alta fidelidad visual.
*   **Biblioteca de Componentes**: [shadcn/ui](https://ui.shadcn.com/) (estilo *New York*, color base *neutral*).
*   **Iconografía**: [Lucide React](https://lucide.dev/) para iconos vectoriales limpios y escalables.
*   **Lector QR**: `html5-qrcode` para la decodificación de flujos de video de cámara en tiempo real.
*   **Gestor de Paquetes**: `pnpm` (administrado por el archivo `pnpm-lock.yaml`).

---

## 2. Arquitectura de Rutas e Interfaz

El proyecto adopta un diseño **mobile-first** restrictivo. Los estilos base en `app/globals.css` bloquean el scroll a nivel de documento (`html, body { height: 100%; overflow: hidden; overscroll-behavior: none; }`) y obligan a la aplicación a comportarse como un contenedor nativo de dispositivo móvil (`.mobile-container` con altura dinámica `100dvh`).

### Mapa de Enrutamiento

| Ruta | Componente / Propósito | Descripción Técnica |
| :--- | :--- | :--- |
| `/` | `BankingHome` | Dashboard principal de banca. Compone el estado del saldo principal, la tarjeta dVaca, el carrusel de recomendaciones basadas en IA y los accesos rápidos a transferencias y servicios. |
| `/devaca` | `DeVacaPage` | Panel de administración del producto de ahorro **dVaca**. Emplea navegación por pestañas (`Resumen`, `Pagar`, `Canjear`, `Configurar`) implementadas como sub-vistas del cliente. |
| `/devaca/pago` | `PagoPage` | Pasarela de validación y confirmación de pagos de transacciones que evalúa la adición de ahorro sugerido en la cuenta corriente. |
| `/scanner` | `ScannerPage` | Lector de códigos QR simulado para flujos genéricos de pagos en la app. |
| `/scanner/devaca` | `ScannerDeVacaPage` | Interfaz de escaneo QR exclusiva para transacciones de comercios locales adheridos a la red dVaca. |
| `/beneficios` | `BeneficiosPage` | Catálogo centralizado de cupones de descuento canjeables mediante el saldo acumulado en la alcancía dVaca. |

---

## 3. Gestión de Estado Global (`DeVacaStore`)

El producto de ahorro **dVaca** se gestiona mediante un flujo unidireccional de datos centralizado en `lib/devaca-store.tsx`. 

### Arquitectura de Datos (`DeVacaState`)

El estado global mantiene una única fuente de verdad para la sesión del usuario con el siguiente tipado:

```typescript
export interface Transaccion {
  id: number;
  lugar: string;
  monto: number;
  ahorro: number;
  fecha: string;
}

export interface Nivel {
  meta: number;
  bonus: number;
}

export interface MiPyme {
  id: string;
  nombre: string;
  categoria: string;
  ahorro: number; // Porcentaje o monto de ahorro sugerido
}

export interface DeVacaState {
  nombreUsuario: string;
  perfilIA: string;
  saldoPrincipal: number;
  ahorroAcumulado: number;
  metaMes: number;
  diasRestantes: number;
  niveles: Nivel[];
  transacciones: Transaccion[];
  mipymes: MiPyme[];
  metaSeleccionadaIndex: number | null; // null = selección de meta automática
}
```

### Operaciones Disponibles (Actions)

El reducer principal procesa las siguientes transacciones lógicas del negocio:
*   `PAGAR_CON_AHORRO`: Debita el monto base más el ahorro sugerido del saldo principal, incrementa el ahorro acumulado e inserta la transacción en el historial.
*   `PAGAR_SIN_AHORRO`: Realiza el débito regular del saldo principal sin afectar el acumulador de ahorro dVaca.
*   `CANJEAR_AHORRO`: Reduce el balance acumulado en función del costo del cupón seleccionado.
*   `ACTUALIZAR_NIVEL`: Modifica dinámicamente las metas o porcentajes de bonus del escalonamiento de ahorros.
*   `SELECCIONAR_META`: Permite al usuario forzar una meta de nivel específica de forma manual o delegar al cálculo automático.

> [!IMPORTANT]
> El componente `<DeVacaProvider>` se monta **únicamente a nivel raíz** en `app/layout.tsx`. No se deben declarar proveedores anidados en layouts de rutas hijas, ya que esto fragmenta el estado en memoria y desvincula las pantallas de transacción de la interfaz principal.

---

## 4. Patrón de Resiliencia en la Carga de Medios (Fallback Pattern)

Para garantizar un rendimiento visual premium y evitar contenedores vacíos, las imágenes de los cupones se cargan en tiempo real usando el generador de imágenes por Inteligencia Artificial `pollinations.ai` mediante una función auxiliar con semilla determinista (`imgFor(b)`).

Dado que la latencia del API externo puede variar (entre 5 y 15 segundos en frío), se implementa un **patrón de fallback visual** de dos capas:
1.  **Capa Base (Degradado + Emoji)**: El contenedor del beneficio se inicializa con un degradado CSS (`linear-gradient`) basado en los colores del comercio, y posiciona en el centro el emoji representativo del producto.
2.  **Capa de Imagen Dinámica**: La etiqueta `<img />` se renderiza de forma absoluta sobre la capa base con el atributo `onError` programado para ocultarse (`e.currentTarget.style.display = "none"`). Si la llamada a `pollinations.ai` falla o expira, la imagen se desvanece de manera transparente y el usuario ve un diseño integrado limpio con la marca del comercio en lugar de un error de renderizado.

---

## 5. Guía de Configuración del Entorno de Desarrollo

### Requisitos Previos

*   **Node.js**: Versión 18 o superior.
*   **pnpm**: Gestor de paquetes recomendado para la resolución de dependencias del monorepo.

### Comandos de Ejecución

1.  **Instalar dependencias**:
    ```bash
    pnpm install
    ```
2.  **Levantar el servidor de desarrollo**:
    ```bash
    pnpm dev
    ```
    La aplicación se expondrá localmente en `http://localhost:3000`.
3.  **Compilar el proyecto para producción**:
    ```bash
    pnpm build
    ```
4.  **Iniciar el servidor en modo de producción**:
    ```bash
    pnpm start
    ```
5.  **Ejecutar el linter para validación estática del código**:
    ```bash
    pnpm lint
    ```

---

## 6. Consideraciones Técnicas de Compilación y Ejecución

*   **TypeScript**: El archivo `next.config.mjs` tiene habilitada la propiedad `typescript.ignoreBuildErrors: true`. Esto evita que las discrepancias de tipos estrictos bloqueen la compilación en producción. Para comprobar la tipificación en desarrollo, ejecute `tsc --noEmit`.
*   **Evitar Bloques `<style jsx>`**: Turbopack en combinación con React 19 y Next.js 16 presenta un bug conocido donde las interpolaciones de texto literal en `<style jsx>` cuelgan el compilador del servidor de desarrollo indefinidamente. Toda estilización personalizada o fotogramas clave (`@keyframes`) deben agregarse directamente en `app/globals.css`.
*   **Procesos Huérfanos en Windows**: Interrupciones forzadas de `pnpm dev` en entornos Windows pueden dejar procesos de Node.js en ejecución en segundo plano. Se recomienda su depuración manual a través de PowerShell mediante:
    ```powershell
    Get-Process node | Stop-Process -Force
    ```
*   **Ciclo de Integración con v0**: Este repositorio está vinculado directamente a un proyecto de v0 (`prj_VIcS6Iyu9U7U4mULmsLWtOQkL9bH`). Cualquier cambio realizado e implementado desde la interfaz web de v0 ejecutará automáticamente commits hacia la rama `main` de este repositorio Git y disparará un despliegue de integración continua (CI/CD).

---

## 7. Autores

El desarrollo y mantenimiento de este proyecto es realizado por:

*   **Donly666** — [jervinpan@gmail.com](mailto:jervinpan@gmail.com)
*   **Michael.Paredes** — [jeyempar@gmail.com](mailto:jeyempar@gmail.com)
*   **María Jose Oliva T.** -- [maria.oliva@upec.edu.ec]
*   **Gariela Villarreal.** -- [gmadelaine.villarreal@upec.edu.ec]
*   **Josthin Fuel** -- [josthin.fuel@upec.edu.ec]
--
