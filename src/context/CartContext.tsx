"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  quantity: number;
  note?: string;
}

export interface ReservationData {
  zoneName: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  specialRequest?: string;
  downPayment: number;
}

interface CartContextType {
  items: CartItem[];
  reservation: ReservationData | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  setReservation: (res: ReservationData | null) => void;
  clearCart: () => void;
  itemCount: number;
  fnbTotal: number;
  reservationTotal: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cafetaria_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [reservation, setReservationState] = useState<ReservationData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.reservation) setReservationState(parsed.reservation);
      }
    } catch (e) {
      console.error("Gagal membaca keranjang dari penyimpanan lokal:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, reservation })
      );
    } catch (e) {
      console.error("Gagal menyimpan keranjang ke penyimpanan lokal:", e);
    }
  }, [items, reservation, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (newItem: Omit<CartItem, "quantity">, qty: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { ...newItem, quantity: qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const setReservation = (res: ReservationData | null) => {
    setReservationState(res);
    if (res) setIsOpen(true);
  };

  const clearCart = () => {
    setItems([]);
    setReservationState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const itemCount =
    items.reduce((total, i) => total + i.quantity, 0) + (reservation ? 1 : 0);

  const fnbTotal = items.reduce(
    (total, i) => total + i.price * i.quantity,
    0
  );

  const reservationTotal = reservation ? reservation.downPayment : 0;
  const totalAmount = fnbTotal + reservationTotal;

  return (
    <CartContext.Provider
      value={{
        items,
        reservation,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        setReservation,
        clearCart,
        itemCount,
        fnbTotal,
        reservationTotal,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}

