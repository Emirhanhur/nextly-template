import dynamic from 'next/dynamic';
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";

const BASE_URL = 'http://localhost:3001';

const SalesProductsClient = dynamic(() => import('./SalesProductsClient'), { ssr: false });

export default async function SalesProductsPage() {
  // Kategorileri ve ürünleri çek
  const [categoriesRes, productsRes] = await Promise.all([
    fetch(`${BASE_URL}/api/sales-categories?limit=1000`, { cache: 'no-store' }),
    fetch(`${BASE_URL}/api/products?limit=1000`, { cache: 'no-store' }),
  ]);
  const categoriesData = await categoriesRes.json();
  const productsData = await productsRes.json();
  const categories = categoriesData.docs || [];
  const products = productsData.docs || [];

  return (
    <AnimatedPageWrapper>
      <Container className="min-h-screen flex flex-col items-center justify-start">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-gray-800 dark:text-white text-center w-full">Satış Kategorileri</h1>
        <SalesProductsClient categories={categories} products={products} />
      </Container>
    </AnimatedPageWrapper>
  );
} 