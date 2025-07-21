"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface CartItem {
  id: number;
  name: string;
  measurementId: number;
  measurementLabel: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  attributes?: { [key: string]: string };
  total?: number;
  productId: number; // eklendi
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (measurementId: number) => void;
  clearCart: () => void;
  updateCartItem: (measurementId: number, updated: Partial<CartItem>) => void; // eklendi
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  // Kullanıcıyı al
  const getUser = () => {
    if (typeof window === 'undefined') return null;
    const userObj = localStorage.getItem("user");
    return userObj ? JSON.parse(userObj) : null;
  };
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("token");
  };

  // Backend'den sepeti çek
  useEffect(() => {
    const user = getUser();
    const token = getToken();
    if (user && token) {
      fetch(`http://localhost:3001/api/cart?where[user][equals]=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.docs && data.docs.length > 0 && data.docs[0].items) {
            setCart(data.docs[0].items); // STATE'E YAZ!
            localStorage.setItem("cart", JSON.stringify(data.docs[0].items));
          } else {
            setCart([]); // Kullanıcının hiç sepeti yoksa boş göster
            localStorage.setItem("cart", "[]");
          }
        })
        .catch(() => {
          setCart([]); // Hata olursa da boş göster
        });
    } else {
      // localStorage'dan yükle
      const stored = localStorage.getItem("cart");
      if (stored) setCart(JSON.parse(stored));
    }
  }, []);

  // Kullanıcı login olduysa ve localStorage'da sepet varsa, backend'e aktar


  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Backend'de sepeti güncelle
  const syncCartToBackend = async (newCart: CartItem[]) => {
    const user = getUser();
    const token = getToken();
    if (!user || !token) return;
    // Önce mevcut cart kaydı var mı kontrol et
    const res = await fetch(`http://localhost:3001/api/cart?where[user][equals]=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data && data.docs && data.docs.length > 0) {
      // Güncelle
      await fetch(`http://localhost:3001/api/cart/${data.docs[0].id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: newCart }),
      });
    } else {
      // Oluştur
      await fetch(`http://localhost:3001/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: user.id, items: newCart }),
      });
    }
  };

  // Backend'de sepeti güncelleyen yeni addToCart fonksiyonu
  const addToCart = async (item: CartItem) => {
    console.log("addToCart çağrıldı", item);
    const user = getUser();
    const token = getToken();
    if (!user || !token) {
      // Giriş yapılmamışsa localStorage'a ekle (isteğe bağlı)
      setCart((prev) => [...prev, item]);
      return;
    }

    // Önce mevcut cart'ı çek
    const res = await fetch(`http://localhost:3001/api/cart?where[user][equals]=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    let newCart: CartItem[] = [];
    let cartId: string | null = null;

    if (data && data.docs && data.docs.length > 0) {
      // Cart zaten var, güncelle
      newCart = [...data.docs[0].items];
      cartId = data.docs[0].id;
      const existing = newCart.find((i) => i.measurementId === item.measurementId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        newCart.push(item);
      }
      await fetch(`http://localhost:3001/api/cart/${cartId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: newCart }),
      });
    } else {
      // Cart yok, yeni oluştur
      newCart = [item];
      await fetch(`http://localhost:3001/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: user.id, items: newCart }),
      });
    }

    // Son olarak backend'den güncel cart'ı çek ve state'e yaz
    const updatedRes = await fetch(`http://localhost:3001/api/cart?where[user][equals]=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedData = await updatedRes.json();
    if (updatedData && updatedData.docs && updatedData.docs.length > 0 && updatedData.docs[0].items) {
      setCart(updatedData.docs[0].items);
      localStorage.setItem("cart", JSON.stringify(updatedData.docs[0].items));
    }
  };

  const removeFromCart = (measurementId: number) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => i.measurementId !== measurementId);
      const user = getUser();
      if (user) syncCartToBackend(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    const user = getUser();
    if (user) syncCartToBackend([]);
  };

  // Backend'de sepeti güncelleyen yeni updateCartItem fonksiyonu
  const updateCartItem = async (measurementId: number, updated: Partial<CartItem>) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.measurementId === measurementId ? { ...item, ...updated } : item
      );
      const user = getUser();
      if (user) syncCartToBackend(newCart);
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
} 