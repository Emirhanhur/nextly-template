import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from "@/components/Container";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250?text=No+Image';
const BASE_URL = 'http://localhost:3001';

interface Category {
  id: number;
  title: string;
  image?: any;
  parent?: number | null | { id: number; title: string };
}

interface Product {
  id: number;
  name: string;
  category?: { id: number } | number;
}

const CategoryPageClient = dynamic(() => import('./CategoryPageClient'), { ssr: false });

export default async function CategoryPage() {
  let categories: Category[] = [];
  let products: Product[] = [];
  let error = null;

  try {
    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${BASE_URL}/api/categories?limit=1000`, { cache: 'no-store' }),
      fetch(`${BASE_URL}/api/products?limit=1000`, { cache: 'no-store' }),
    ]);
    const categoriesData = await categoriesRes.json();
    const productsData = await productsRes.json();
    categories = categoriesData.docs || [];
    products = productsData.docs || [];
  } catch (err) {
    error = 'Kategoriler yüklenemedi';
  }

  if (error) {
    return <div className="p-10 text-3xl font-bold text-red-500">{error}</div>;
  }

  // Her kategori için ürün sayısını hesapla
  const getProductCount = (cat: Category) => {
    return products.filter(
      (p) => {
        if (typeof p.category === 'object' && p.category !== null) {
          return p.category.id === cat.id;
        }
        if (typeof p.category === 'number') {
          return p.category === cat.id;
        }
        return false;
      }
    ).length;
  };

  // Kategori görselini hazırla
  const getCategoryImage = (cat: Category) => {
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
    <AnimatedPageWrapper>
      <Container className="min-h-screen flex flex-col items-center justify-start">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-800 dark:text-white text-center w-full">Kategoriler</h1>
        <CategoryPageClient categories={categories} />
      </Container>
    </AnimatedPageWrapper>
  );
} 