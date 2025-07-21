import axios from 'axios';
import Link from 'next/link';
import ProductTabs from '../../components/ProductTabs';
import { PageProps } from '../../types';
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";

// Basit bir Product tipi tanımla
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
}

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250?text=No+Image';
const BASE_URL = 'http://localhost:3001';

export default async function ProductPage({ searchParams }: PageProps) {
  let products: any[] = [];
  let categories: Category[] = [];
  let error = null;

  try {
    const [productsRes, measurementsRes, categoriesRes] = await Promise.all([
      fetch('http://localhost:3001/api/products', { cache: 'no-store' }),
      fetch('http://localhost:3001/api/measurements', { cache: 'no-store' }),
      fetch('http://localhost:3001/api/categories?limit=1000', { cache: 'no-store' }),
    ]);
    const productsData = await productsRes.json();
    const measurementsData = await measurementsRes.json();
    const categoriesData = await categoriesRes.json();
    products = productsData.docs || [];
    categories = categoriesData.docs || [];
  } catch (err) {
    error = 'Ürünler yüklenemedi';
  }

  if (error) {
    return <div className="p-10 text-3xl font-bold text-red-500">{error}</div>;
  }

  // Ürünlerin category'sini {id, title} formatına dönüştür
  const getCategoryObj = (catId: number | undefined) => {
    if (!catId) return undefined;
    const found = categories.find((c) => c.id === catId);
    return found ? { id: found.id, title: found.title } : undefined;
  };

  const productsWithCategory = products.map((p) => ({
    ...p,
    category: p.category && typeof p.category === 'object' && 'id' in p.category
      ? p.category
      : getCategoryObj(typeof p.category === 'number' ? p.category : undefined),
  }));

  const satisUrunleri = productsWithCategory.filter((product) => product.status === 'true');
  const bilgiUrunleri = productsWithCategory.filter((product) => product.status !== 'true');

  // Query parametresinden kategori id'sini al
  const selectedCategoryId = searchParams?.category ? Number(searchParams.category) : null;

  return (
    <AnimatedPageWrapper>
      <Container className="min-h-screen flex flex-col items-center justify-start">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-800 dark:text-white text-center w-full">Ürünler</h1>
        <ProductTabs
          satisUrunleri={satisUrunleri}
          bilgiUrunleri={bilgiUrunleri}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
        />
      </Container>
    </AnimatedPageWrapper>
  );
} 