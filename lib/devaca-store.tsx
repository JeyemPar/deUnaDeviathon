"use client"

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  type ReactNode,
} from "react"

export interface Transaccion {
  id: number
  lugar: string
  monto: number
  ahorro: number
  fecha: string
}

export interface Nivel {
  meta: number
  bonus: number
}

export interface MiPyme {
  id: string
  nombre: string
  categoria: string
  ahorro: number
}

export interface DeVacaState {
  nombreUsuario: string
  perfilIA: string
  saldoPrincipal: number
  ahorroAcumulado: number
  metaMes: number
  diasRestantes: number
  niveles: Nivel[]
  transacciones: Transaccion[]
  mipymes: MiPyme[]
  // Si null: se elige automáticamente la primera meta no alcanzada.
  // Si número: el índice de niveles elegido por el usuario.
  metaSeleccionadaIndex: number | null
}

const NIVELES_DEFAULT: Nivel[] = [
  { meta: 30, bonus: 20 },
  { meta: 40, bonus: 30 },
  { meta: 50, bonus: 40 },
]

const MIPYMES_DEFAULT: MiPyme[] = [
  { id: "MP001", nombre: "Tienda Don Carlos", categoria: "Abarrotes", ahorro: 0.3 },
  { id: "MP002", nombre: "Comedor La Esquina", categoria: "Restaurante", ahorro: 0.5 },
  { id: "MP003", nombre: "Minimarket El Pana", categoria: "Minimarket", ahorro: 0.4 },
  { id: "MP004", nombre: "Papelería Central", categoria: "Papelería", ahorro: 0.2 },
]

const TX_DEFAULT: Transaccion[] = [
  { id: 1, lugar: "Tienda Don Carlos", monto: 2.8, ahorro: 0.3, fecha: "Hoy" },
  { id: 2, lugar: "Comedor La Esquina", monto: 3.5, ahorro: 0.5, fecha: "Ayer" },
  { id: 3, lugar: "Minimarket El Pana", monto: 5.2, ahorro: 0.7, fecha: "Lun" },
  { id: 4, lugar: "Papelería Central", monto: 1.8, ahorro: 0.2, fecha: "Dom" },
]

const INITIAL_STATE: DeVacaState = {
  nombreUsuario: "Juan",
  perfilIA: "Activo",
  saldoPrincipal: 10.45,
  ahorroAcumulado: 28.5,
  metaMes: 30,
  diasRestantes: 6,
  niveles: NIVELES_DEFAULT,
  transacciones: TX_DEFAULT,
  mipymes: MIPYMES_DEFAULT,
  metaSeleccionadaIndex: null,
}

type Action =
  | { type: "PAGAR_CON_AHORRO"; mipymeId: string; monto: number }
  | { type: "PAGAR_SIN_AHORRO"; mipymeId: string; monto: number }
  | { type: "CANJEAR_AHORRO"; opcion: number; monto: number }
  | {
      type: "ACTUALIZAR_NIVEL"
      index: number
      campo: "meta" | "bonus"
      valor: number
    }
  | { type: "ACTUALIZAR_SALDO_PRINCIPAL"; monto: number }
  | { type: "RESTAURAR_NIVELES" }
  | { type: "SELECCIONAR_META"; index: number | null }

function reducer(state: DeVacaState, action: Action): DeVacaState {
  switch (action.type) {
    case "PAGAR_CON_AHORRO": {
      const mipyme = state.mipymes.find((m) => m.id === action.mipymeId)
      if (!mipyme || action.monto <= 0) return state
      const ahorro = mipyme.ahorro
      const totalDebito = action.monto + ahorro
      const tx: Transaccion = {
        id: Date.now(),
        lugar: mipyme.nombre,
        monto: totalDebito,
        ahorro,
        fecha: "Ahora",
      }
      return {
        ...state,
        saldoPrincipal: Math.max(0, state.saldoPrincipal - totalDebito),
        ahorroAcumulado: state.ahorroAcumulado + ahorro,
        transacciones: [tx, ...state.transacciones],
      }
    }
    case "PAGAR_SIN_AHORRO": {
      const mipyme = state.mipymes.find((m) => m.id === action.mipymeId)
      if (!mipyme || action.monto <= 0) return state
      const tx: Transaccion = {
        id: Date.now(),
        lugar: mipyme.nombre,
        monto: action.monto,
        ahorro: 0,
        fecha: "Ahora",
      }
      return {
        ...state,
        saldoPrincipal: Math.max(0, state.saldoPrincipal - action.monto),
        transacciones: [tx, ...state.transacciones],
      }
    }
    case "CANJEAR_AHORRO":
      return {
        ...state,
        ahorroAcumulado: Math.max(0, state.ahorroAcumulado - action.monto),
      }
    case "ACTUALIZAR_NIVEL": {
      const niveles = state.niveles.map((n, i) =>
        i === action.index ? { ...n, [action.campo]: action.valor } : n
      )
      return { ...state, niveles, metaMes: niveles[0]?.meta ?? state.metaMes }
    }
    case "ACTUALIZAR_SALDO_PRINCIPAL":
      return { ...state, saldoPrincipal: Math.max(0, action.monto) }
    case "RESTAURAR_NIVELES":
      return {
        ...state,
        niveles: NIVELES_DEFAULT,
        metaMes: NIVELES_DEFAULT[0].meta,
        metaSeleccionadaIndex: null,
      }
    case "SELECCIONAR_META": {
      if (action.index === null) {
        return { ...state, metaSeleccionadaIndex: null }
      }
      if (action.index < 0 || action.index >= state.niveles.length) {
        return state
      }
      return { ...state, metaSeleccionadaIndex: action.index }
    }
    default:
      return state
  }
}

interface DeVacaContextValue {
  state: DeVacaState
  pagarConAhorro: (mipymeId: string, monto: number) => void
  pagarSinAhorro: (mipymeId: string, monto: number) => void
  canjearAhorro: (opcion: number, monto: number) => void
  actualizarNivel: (
    index: number,
    campo: "meta" | "bonus",
    valor: number
  ) => void
  actualizarSaldoPrincipal: (monto: number) => void
  restaurarNiveles: () => void
  seleccionarMeta: (index: number | null) => void
}

const DeVacaCtx = createContext<DeVacaContextValue | null>(null)

export function DeVacaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const pagarConAhorro = useCallback((mipymeId: string, monto: number) => {
    dispatch({ type: "PAGAR_CON_AHORRO", mipymeId, monto })
  }, [])

  const pagarSinAhorro = useCallback((mipymeId: string, monto: number) => {
    dispatch({ type: "PAGAR_SIN_AHORRO", mipymeId, monto })
  }, [])

  const canjearAhorro = useCallback((opcion: number, monto: number) => {
    dispatch({ type: "CANJEAR_AHORRO", opcion, monto })
  }, [])

  const actualizarNivel = useCallback(
    (index: number, campo: "meta" | "bonus", valor: number) => {
      dispatch({ type: "ACTUALIZAR_NIVEL", index, campo, valor })
    },
    []
  )

  const actualizarSaldoPrincipal = useCallback((monto: number) => {
    dispatch({ type: "ACTUALIZAR_SALDO_PRINCIPAL", monto })
  }, [])

  const restaurarNiveles = useCallback(() => {
    dispatch({ type: "RESTAURAR_NIVELES" })
  }, [])

  const seleccionarMeta = useCallback((index: number | null) => {
    dispatch({ type: "SELECCIONAR_META", index })
  }, [])

  return (
    <DeVacaCtx.Provider
      value={{
        state,
        pagarConAhorro,
        pagarSinAhorro,
        canjearAhorro,
        actualizarNivel,
        actualizarSaldoPrincipal,
        restaurarNiveles,
        seleccionarMeta,
      }}
    >
      {children}
    </DeVacaCtx.Provider>
  )
}

export function useDeVaca() {
  const ctx = useContext(DeVacaCtx)
  if (!ctx) {
    throw new Error("useDeVaca debe usarse dentro de <DeVacaProvider>")
  }
  return ctx
}

export const DEVACA_DEFAULTS = {
  niveles: NIVELES_DEFAULT,
  mipymes: MIPYMES_DEFAULT,
}

// Devuelve el índice del nivel que el usuario tiene activo como meta.
// Si eligió uno manualmente, ese; si no, la primera meta sin alcanzar
// (o el último nivel si ya superó todas).
export function getMetaActivaIndex(state: DeVacaState): number {
  const { metaSeleccionadaIndex, niveles, ahorroAcumulado } = state
  if (
    metaSeleccionadaIndex !== null &&
    metaSeleccionadaIndex >= 0 &&
    metaSeleccionadaIndex < niveles.length
  ) {
    return metaSeleccionadaIndex
  }
  for (let i = 0; i < niveles.length; i++) {
    if (ahorroAcumulado < niveles[i].meta) return i
  }
  return Math.max(0, niveles.length - 1)
}
