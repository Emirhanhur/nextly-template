"use client";
import { useCart } from "./CartContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartWidget() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !phone || !address) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    const token = localStorage.getItem("token");
    const userObj = localStorage.getItem("user");
    const user = userObj ? JSON.parse(userObj) : null;
    if (!token) {
      setError("Sipariş verebilmek için giriş yapmalısınız.");
      return;
    }
    if (!user || !user.id) {
      setError("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: user.id,
          name,
          phone,
          address,
          total,
          products: cart.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            attributes: item.attributes || {},
            image: item.imageUrl || null, // Ürün resmi eklendi
          })),
        }),
      });
      if (!res.ok) {
        throw new Error("Sipariş gönderilemedi. Lütfen tekrar deneyin.");
      }
      setSuccess("Siparişiniz başarıyla alındı!");
      clearCart();
      setName(""); setPhone(""); setAddress("");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 border"
        onClick={() => router.push('/cart')}
        aria-label="Sepetim"
      >
        <span role="img" aria-label="cart">🛒</span>
        <span className="font-bold">{cart.length}</span>
      </button>
    </div>
  );
} 