"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250?text=No+Image';
const BASE_URL = 'http://localhost:3001';

interface Product {
  id: number;
  name: string;
  image?: any;
  description?: string;
  status?: string;
  category?: { id: number; title: string };
  price?: number; // Added price field
}

export default function CategoryProductsPage() {
  const params = useParams();
  const categoryId = params?.id;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState<string>("");

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    fetch(`http://localhost:3001/api/products?where[category][equals]=${categoryId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data?.docs) ? data.docs : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    fetch(`http://localhost:3001/api/sales-categories/${categoryId}`)
      .then(res => res.json())
      .then(data => setCategoryTitle(data?.title || ""))
      .catch(() => setCategoryTitle(""));
  }, [categoryId]);

  const getProductImage = (product: Product) => {
    if (!product?.image) return PLACEHOLDER_IMG;
    if (typeof product.image === 'object') {
      if (product.image.sizes?.thumbnail?.url) {
        return product.image.sizes.thumbnail.url.startsWith('/')
          ? BASE_URL + product.image.sizes.thumbnail.url
          : product.image.sizes.thumbnail.url;
      } else if (product.image.url) {
        return product.image.url.startsWith('/')
          ? BASE_URL + product.image.url
          : product.image.url;
      }
    } else if (typeof product.image === 'string') {
      return product.image.startsWith('/') ? BASE_URL + product.image : product.image;
    }
    return PLACEHOLDER_IMG;
  };

  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  return (
    <AnimatedPageWrapper>
      <Container className="min-h-screen flex flex-col items-center justify-start">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-800 dark:text-white text-center w-full">{categoryTitle || "Kategori"} Ürünleri</h1>
        {loading ? (
          <div className="py-8 text-lg text-gray-500 dark:text-gray-300">Yükleniyor...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-8 text-lg text-gray-500 dark:text-gray-300">Bu kategoriye ait ürün bulunamadı.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {sortedProducts.map(product => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-xl shadow-md p-6 border hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between cursor-pointer no-underline hover:no-underline"
              >
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 border"
                  loading="lazy"
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {product.category && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {product.category.title}
                      </span>
                    )}
                    {product.status && (
                      <span className={`inline-block ml-auto text-xs px-2 py-1 rounded-full ${product.status === 'true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.status === 'true' ? 'Aktif' : 'Pasif'}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[40px]">{product.description}</p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="text-2xl font-extrabold text-indigo-600">{product.price}₺</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </AnimatedPageWrapper>
  );
} 