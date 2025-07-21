"use client";
import { useCart } from "@/components/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";

// Confetti için basit bir paket (canvas-confetti) kullanılabilir, burada örnek animasyon için basit bir svg animasyonu ekliyorum.

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <g>
          <circle cx="100" cy="100" r="6" fill="#6366f1">
            <animate attributeName="r" values="6;30;6" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="80" r="4" fill="#f59e42">
            <animate attributeName="cy" values="80;40;80" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="120" r="4" fill="#10b981">
            <animate attributeName="cy" values="120;160;120" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

function EmptyCartAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <svg width="120" height="120" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="13" rx="2" fill="#e0e7ff" />
        <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#6366f1" strokeWidth="2" />
        <circle cx="9" cy="19" r="2" fill="#6366f1" />
        <circle cx="15" cy="19" r="2" fill="#6366f1" />
      </svg>
      <div className="mt-4 text-lg text-indigo-500 font-semibold animate-bounce">Sepetiniz boş!</div>
    </div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateCartItem } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editAttributesMeta, setEditAttributesMeta] = useState<any[]>([]); // ürün attribute seçenekleri
  const [editLoading, setEditLoading] = useState(false);

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
            name: item.name + (item.measurementLabel ? ` (${item.measurementLabel})` : ""),
            quantity: item.quantity,
            attributes: item.attributes || {},
            image: item.imageUrl || null,
          })),
        }),
      });
      if (!res.ok) {
        throw new Error("Sipariş gönderilemedi. Lütfen tekrar deneyin.");
      }
      setSuccess("Siparişiniz başarıyla alındı!");
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    clearCart();
    setShowSuccess(false);
    router.push("/");
  };

  // Fade-out animasyonu için kaldırma
  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 400);
  };

  // Modal açıcı
  const handleEditOpen = async (item: any) => {
    setEditItem({ ...item });
    setEditModalOpen(true);
    setEditLoading(true);
    // Ürün attribute seçeneklerini çek
    try {
      const res = await fetch(`http://localhost:3001/api/products/${item.productId}`);
      const data = await res.json();
      setEditAttributesMeta(data.attributes || []);
    } catch {
      setEditAttributesMeta([]);
    } finally {
      setEditLoading(false);
    }
  };
  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditItem(null);
    setEditAttributesMeta([]);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditItem((prev: any) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };
  // Attribute değişimi
  const handleAttributeChange = (attrName: string, value: any) => {
    setEditItem((prev: any) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attrName]: typeof prev.attributes[attrName] === 'object' && prev.attributes[attrName] !== null
          ? { ...prev.attributes[attrName], value, label: value }
          : value
      }
    }));
  };
  const handleEditSave = () => {
    if (editItem) {
      updateCartItem(editItem.measurementId, {
        quantity: editItem.quantity,
        attributes: editItem.attributes,
      });
      handleEditClose();
    }
  };

  return (
    <AnimatedPageWrapper>
      {/* Modal */}
      {editModalOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in-up">
            <button onClick={handleEditClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">✕</button>
            <h2 className="text-xl font-bold mb-4">Ürünü Düzenle</h2>
            <div className="mb-4">
              <div className="font-semibold mb-2">{editItem.name}</div>
              <div className="mb-2">Birim Fiyat: {editItem.price}₺</div>
              <label className="block mb-2">Adet:
                <input type="number" name="quantity" min={1} value={editItem.quantity} onChange={handleEditChange} className="ml-2 border rounded px-2 py-1 w-20" />
              </label>
              {/* Eğer attributes varsa onları da düzenlenebilir göster */}
              {editLoading ? (
                <div>Yükleniyor...</div>
              ) : (
                editAttributesMeta && editAttributesMeta.length > 0 && (
                  <div className="space-y-2">
                    {editAttributesMeta.map((attr: any) => (
                      <div key={attr.name} className="mb-2">
                        <div className="font-medium mb-1">{attr.name}:</div>
                        {Array.isArray(attr.options) && attr.options.length > 0 ? (
                          <div className="flex flex-row gap-2 flex-wrap">
                            {attr.options.map((opt: any) => (
                              <label key={opt.label} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`attr_${attr.name}`}
                                  value={opt.label}
                                  checked={editItem.attributes && ((typeof editItem.attributes[attr.name] === 'object' && editItem.attributes[attr.name]?.value === opt.label) || editItem.attributes[attr.name] === opt.label)}
                                  onChange={() => handleAttributeChange(attr.name, opt.label)}
                                />
                                <span>{opt.label}{opt.price ? ` (+${opt.price}₺)` : ''}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            name={`attr_${attr.name}`}
                            value={typeof editItem.attributes[attr.name] === 'object' && editItem.attributes[attr.name] !== null ? editItem.attributes[attr.name].value || '' : editItem.attributes[attr.name] || ''}
                            onChange={e => handleAttributeChange(attr.name, e.target.value)}
                            className="ml-2 border rounded px-2 py-1 w-32"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
            <button onClick={handleEditSave} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 mt-2 w-full">Güncelle</button>
          </div>
        </div>
      )}
      <Container className="min-h-screen flex flex-col items-center justify-start">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 dark:text-white text-center w-full animate-fade-in">Sepetim</h1>
        {cart.length === 0 && !showSuccess ? (
          <EmptyCartAnimation />
        ) : (
          <div className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-12 animate-fade-in-up flex flex-col md:flex-row gap-8">
            {/* Ürünler Listesi */}
            <div className="flex-1 min-w-0">
              <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto mb-6 pr-2">
                {cart.map((item) => (
                  <li
                    key={item.measurementId || item.id}
                    className={`py-4 flex items-center justify-between gap-4 transition-all duration-500 bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-md mb-3 hover:scale-[1.025] hover:shadow-xl group ${removingId === (item.measurementId || item.id) ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                    style={{ pointerEvents: removingId === (item.measurementId || item.id) ? 'none' : 'auto' }}
                  >
                    {/* Ürün tıklanabilir alanı */}
                    <div
                      className="flex items-center gap-4 min-w-0 cursor-pointer hover:bg-indigo-100/60 rounded-lg transition-all duration-200 px-2 py-1"
                      onClick={() => handleEditOpen(item)}
                      title="Sepet Ürününü Düzenle"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border shadow group-hover:rotate-2 group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <img
                          src="/img/default.jpg"
                          alt="Resim yok"
                          className="w-16 h-16 object-cover rounded border opacity-50"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-lg text-gray-900 dark:text-white animate-fade-in-up delay-100 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">Adet: {item.quantity}</div>
                        <div className="text-xs text-gray-500">Birim Fiyat: {item.price}₺</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-indigo-600 text-lg animate-glow">{item.price * item.quantity}₺</span>
                      <button
                        onClick={() => handleRemove(item.measurementId || item.id)}
                        className="text-xs text-red-500 hover:underline mt-2 transition-colors duration-200 hover:text-red-700"
                      >
                        Kaldır
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Sipariş Özeti ve Form */}
            <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col gap-6">
              <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-xl px-6 py-5 shadow animate-glow flex flex-col gap-2">
                <span className="font-bold text-lg">Toplam:</span>
                <span className="text-2xl font-extrabold text-indigo-700 animate-glow">{total}₺</span>
                {!showSuccess && <button onClick={clearCart} className="mt-2 text-xs text-gray-400 hover:underline animate-fade-in">Sepeti Temizle</button>}
              </div>
              {/* Sipariş Formu */}
              {!showSuccess && (
                <form className="space-y-4 animate-fade-in-up" onSubmit={handleOrder}>
                  <input
                    type="text"
                    className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow"
                    placeholder="Ad Soyad"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow"
                    placeholder="Telefon"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full border-2 border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white transition-all duration-200 shadow"
                    placeholder="Adres"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                  />
                  {error && <div className="text-red-600 text-sm animate-fade-in">{error}</div>}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-3 rounded-xl font-bold hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                    disabled={loading}
                  >
                    {loading && <span className="loader border-2 border-white border-t-indigo-600 rounded-full w-5 h-5 animate-spin"></span>}
                    {loading ? "Sipariş Veriliyor..." : "Sipariş Ver"}
                  </button>
                </form>
              )}
              {showSuccess && (
                <div className="flex flex-col items-center justify-center py-8 animate-fade-in-up">
                  <Confetti />
                  <div className="text-green-600 text-2xl font-bold mb-4 animate-bounce">Siparişiniz başarıyla alındı!</div>
                  <button onClick={handleSuccessClose} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 mt-2 transition-all duration-200">Tamam</button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 8px #a5b4fc, 0 0 2px #6366f1; }
          50% { text-shadow: 0 0 24px #6366f1, 0 0 8px #a5b4fc; }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-glow { animation: glow 2s infinite alternate; }
      `}</style>
    </AnimatedPageWrapper>
  );
} 