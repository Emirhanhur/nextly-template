"use client";
import { useState } from 'react';
import Link from 'next/link';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250?text=No+Image';
const BASE_URL = 'http://localhost:3001';

export default function SalesProductsClient({ categories, products }: {
  categories: any[];
  products: any[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.category &&
          ((typeof p.category === 'object' && p.category.id === selectedCategory.id) ||
            p.category === selectedCategory.id)
      )
    : products;

  const getCategoryImage = (cat: any) => {
    if (!cat) return PLACEHOLDER_IMG;
    if (cat.image && typeof cat.image === 'object') {
      const imgObj = cat.image;
      if (imgObj.sizes && imgObj.sizes.thumbnail && imgObj.sizes.thumbnail.url) {
        return imgObj.sizes.thumbnail.url.startsWith('/')
          ? BASE_URL + imgObj.sizes.thumbnail.url
          : imgObj.sizes.thumbnail.url;
      } else if (imgObj.url) {
        return imgObj.url.startsWith('/')
          ? BASE_URL + imgObj.url
          : imgObj.url;
      }
    } else if (cat.image && typeof cat.image === 'string') {
      return cat.image.startsWith('/')
        ? BASE_URL + cat.image
        : cat.image;
    }
    return PLACEHOLDER_IMG;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">Kategoriler</h2>
        <ul>
          <li className="mb-2">
            <button
              className={`block w-full text-left py-1 px-2 rounded ${!selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory(null)}
            >
              Tümü
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id} className="mb-2">
              <button
                className={`block w-full text-left py-1 px-2 rounded ${selectedCategory?.id === cat.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Satıştaki Ürünlerimiz</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-8 text-lg text-gray-500">Bu kategoriye ait ürün bulunamadı.</div>
          ) : (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="block bg-white rounded-xl shadow-md p-6 border hover:shadow-xl transition-shadow duration-200 cursor-pointer no-underline hover:no-underline"
              >
                <img
                  src={getCategoryImage(categories.find((cat: any) => cat.id === (typeof product.category === 'object' ? product.category.id : product.category)))}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4 border"
                  loading="lazy"
                />
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{product.name}</h2>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 