"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";
interface Order {
  id: string;
  createdAt: string;
  total: number;
  address: string;
  products: { name: string; quantity: number; productId?: string; attributes?: Record<string, any>; image?: string }[];
}

interface ProductDetail {
  id: string;
  name: string;
  image?: string;
  // Diğer gerekli alanlar eklenebilir
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ name?: string; email?: string; addresses?: string[] } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<Record<string, ProductDetail>>({});

  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!userStr) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(userStr);
      setUser(parsed);
      // Siparişleri çek
      const token = localStorage.getItem("token");
      if (token && parsed.id) {
        fetch(`http://localhost:3001/api/orders?where[user][equals]=${parsed.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data?.docs)) setOrders(data.docs);
            else setOrders([]);
          })
          .catch(() => setOrders([]))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch {
      setUser(null);
      setLoading(false);
    }
  }, [router]);

  // Ürün detaylarını çek
  useEffect(() => {
    if (orders.length > 0) {
      const productIds = Array.from(
        new Set(orders.flatMap(order => order.products.map(p => p.productId).filter(Boolean)))
      );
      if (productIds.length > 0) {
        fetch(`http://localhost:3001/api/products?where[id][in]=${productIds.join(",")}`)
          .then(res => res.json())
          .then(data => {
            const details: Record<string, ProductDetail> = {};
            if (Array.isArray(data?.docs)) {
              data.docs.forEach((prod: ProductDetail) => {
                details[prod.id] = prod;
              });
            }
            setProductDetails(details);
          });
      }
    }
  }, [orders]);

  return (
    <AnimatedPageWrapper>
      <Container className="max-w-3xl mx-auto py-10 min-h-screen">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 dark:text-white text-center">Profilim</h1>
        {user && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 flex items-center justify-center bg-indigo-500 text-white rounded-full font-bold text-3xl">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.name || "Kullanıcı"}</div>
              <div className="text-gray-600 dark:text-gray-300 mb-2">{user.email || "-"}</div>
              {user.addresses && user.addresses.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Adreslerim:</div>
                  <div className="flex flex-wrap gap-2">
                    {user.addresses.map((addr, i) => (
                      <div key={i} className="bg-indigo-50 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 border border-indigo-200 dark:border-gray-700">
                        {addr}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Geçmiş Siparişlerim</h2>
        {loading ? (
          <div className="text-gray-500">Yükleniyor...</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <svg width="120" height="120" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="13" rx="2" fill="#e0e7ff" />
              <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#6366f1" strokeWidth="2" />
              <circle cx="9" cy="19" r="2" fill="#6366f1" />
              <circle cx="15" cy="19" r="2" fill="#6366f1" />
            </svg>
            <div className="mt-4 text-lg text-indigo-500 font-semibold animate-bounce">Hiç siparişiniz yok!</div>
          </div>
        ) : (
          <div className="overflow-x-auto animate-fade-in-up">
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Ürünler</th>
                  <th className="px-4 py-2 text-left">Adres</th>
                  <th className="px-4 py-2 text-left">Tarih</th>
                  <th className="px-4 py-2 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} className="border-t border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-indigo-50/40 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-2">
                      <ul className="list-none pl-0">
                        {order.products.map((p, i) => {
                          const detail = p.productId ? productDetails[p.productId] : undefined;
                          return (
                            <li key={i} className="flex items-center gap-3 mb-2">
                              {(p.image || detail?.image) && (
                                <img
                                  src={p.image || detail?.image}
                                  alt={p.name}
                                  className="w-14 h-14 object-cover rounded-xl border shadow"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-sm">{p.name}sdffasdsdfafsdsdfa</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {p.attributes &&
                                    Object.entries(p.attributes).map(([key, attr]: [string, any]) => (
                                      <span key={key} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs mr-1">
                                        {key}: {attr.label || attr.value || JSON.stringify(attr)}
                                      </span>
                                    ))}
                                </div>
                                <span className="inline-block mt-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">Adet: {p.quantity}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                    <td className="px-4 py-2 max-w-[180px] truncate">{order.address}</td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString("tr-TR")}</td>
                    <td className="px-4 py-2 text-right font-bold text-indigo-600">{order.total}₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
      <style jsx global>{`
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1) both; }
  .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-bounce { animation: bounce 1.2s infinite alternate; }
  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
  }
`}</style>
    </AnimatedPageWrapper>
  );
} 