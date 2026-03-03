'use client'
import { createContext, useContext, useRef, ReactNode } from 'react'
import { createStore, useStore } from 'zustand'

interface BookingState {
  selectedService: string | null
  selectedBarber: string | null
  selectedDate: Date | null
  selectedTime: string | null
  customerInfo: { name: string; email: string; phone: string } | null
  isSubmitting: boolean
  error: string | null
}

interface BookingActions {
  selectService: (id: string) => void
  selectBarber: (id: string) => void
  selectDate: (date: Date) => void
  selectTime: (time: string) => void
  setCustomerInfo: (info: BookingState['customerInfo']) => void
  setSubmitting: (val: boolean) => void
  setError: (msg: string | null) => void
  reset: () => void
}

const initialState: BookingState = {
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  customerInfo: null,
  isSubmitting: false,
  error: null,
}

const createBookingStore = () =>
  createStore<BookingState & BookingActions>()((set) => ({
    ...initialState,
    selectService: (id) => set({ selectedService: id, error: null }),
    selectBarber: (id) => set({ selectedBarber: id, error: null }),
    selectDate: (date) => set({ selectedDate: date, error: null }),
    selectTime: (time) => set({ selectedTime: time, error: null }),
    setCustomerInfo: (info) => set({ customerInfo: info, error: null }),
    setSubmitting: (val) => set({ isSubmitting: val }),
    setError: (msg) => set({ error: msg }),
    reset: () => set(initialState),
  }))

// Context + useRef pattern: each component tree gets its own store instance
// Prevents shared state across concurrent server renders (Next.js App Router safe)
const BookingStoreContext = createContext<ReturnType<typeof createBookingStore> | null>(null)

export function BookingStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createBookingStore>>()
  if (!storeRef.current) {
    storeRef.current = createBookingStore()
  }
  return (
    <BookingStoreContext.Provider value={storeRef.current}>
      {children}
    </BookingStoreContext.Provider>
  )
}

export function useBookingStore<T>(selector: (state: BookingState & BookingActions) => T): T {
  const store = useContext(BookingStoreContext)
  if (!store) throw new Error('useBookingStore must be used within BookingStoreProvider')
  return useStore(store, selector)
}
