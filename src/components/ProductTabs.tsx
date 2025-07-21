"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  image?: any;
  description?: string;
  status?: string;
  category?: { id: number; title: string };
}

interface Category {
  id: number;
  title: string;
  parent?: number | null | { id: number; title: string };
  image?: any; // Added image field
}

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250?text=No+Image';
const BASE_URL = 'http://localhost:3001';

interface ProductTabsProps {
  satisUrunleri: Product[];
  bilgiUrunleri: Product[];
  categories: Category[];
  selectedCategoryId?: number | null;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ satisUrunleri, categories: initialCategories, selectedCategoryId }) => {
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [salesCategories, setSalesCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const router = useRouter();

  // Satış kategorilerini API'den çek
  useEffect(() => {
    setLoadingCategories(true);
    fetch('http://localhost:3001/api/sales-categories?limit=1000')
      .then(res => {
        if (!res.ok) throw new Error('Kategoriler alınamadı');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setSalesCategories(data);
        } else if (Array.isArray(data?.docs)) {
          setSalesCategories(data.docs);
        } else {
          setSalesCategories([]);
        }
        setErrorCategories(null);
      })
      .catch(err => {
        setErrorCategories(err.message || 'Kategoriler alınamadı');
        setSalesCategories([]);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  // İlk render'da selectedCategoryId varsa onu seçili yap
  React.useEffect(() => {
    if (selectedCategoryId && initialCategories.length > 0) {
      const found = initialCategories.find((cat) => cat.id === selectedCategoryId);
      if (found) {
        setSelectedCategory(found);
        const parent = found.parent;
        if (parent && typeof parent === 'object' && parent !== null && 'id' in parent) {
          setSelectedParent(initialCategories.find((cat) => cat.id === parent.id) || null);
        } else if (typeof parent === 'number') {
          setSelectedParent(initialCategories.find((cat) => cat.id === parent) || null);
        } else {
          setSelectedParent(null);
        }
      }
    }
  }, [selectedCategoryId, initialCategories]);

  // Kategorileri alfabetik sırala
  const sortedSalesCategories = [...salesCategories].sort((a, b) => a.title.localeCompare(b.title, 'tr'));

  // Seçili kategoriye göre ürünleri filtrele
  let filteredProducts = satisUrunleri;
  if (selectedCategory) {
    filteredProducts = satisUrunleri.filter(
      (p) => p.category && p.category.id === selectedCategory.id
    );
  } else if (selectedParent) {
    filteredProducts = satisUrunleri.filter(
      (p) => p.category && p.category.id === selectedParent.id
    );
  }
  // Ürünleri alfabetik sırala
  const sortedFilteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  const getCategoryImage = (cat: Category | undefined) => {
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Container>
        <main className="flex-12 p-10">
          <h1 className="text-4xl font-extrabold mb-10 text-gray-800 dark:text-white">Satıştaki Ürünlerin Kategorileri</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
            {sortedSalesCategories.map(cat => {
              const productCount = satisUrunleri.filter(p => p.category && p.category.id === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 border hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => router.push(`/categories/${cat.id}`)}
                >
                  <img
                    src={getCategoryImage(cat)}
                    alt={cat.title}
                    className="w-full h-32 object-cover rounded-lg mb-4 border"
                    loading="lazy"
                  />
                  <span className="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">{cat.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">{productCount} ürün</span>
                </div>
              );
            })}
          </div>

          {/* Seçili kategori başlığı ve Tümünü Göster butonu */}
        </main>
      </Container>
    </div>
  );
};

export default ProductTabs; 