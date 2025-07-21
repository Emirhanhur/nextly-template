"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Giriş başarısız. Bilgilerinizi kontrol edin.");
      }
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Sepeti backend'den çek
        fetch(`http://localhost:3001/api/cart?where[user][equals]=${data.user.id}`, {
          headers: { Authorization: `Bearer ${data.token}` }
        })
          .then(res => res.json())
          .then(cartData => {
            if (cartData && cartData.docs && cartData.docs.length > 0 && cartData.docs[0].items) {
              localStorage.setItem("cart", JSON.stringify(cartData.docs[0].items));
            }
          });
      }
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageWrapper>
      <Container className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border dark:border-gray-700"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700 dark:text-indigo-300">Giriş Yap</h1>
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-900 px-4 py-2 rounded text-center">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Şifre</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </Container>
    </AnimatedPageWrapper>
  );
} 