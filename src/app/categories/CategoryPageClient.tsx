"use client";
import CategorySidebar from '../../components/CategorySidebar';
import { useState, useEffect } from 'react';

interface Category {
  id: number;
  title: string;
  image?: any;
  parent?: number | null | { id: number; title: string };
}

interface Work {
  id: number;
  title: string;
  image: any; // API'den media objesi dönebilir
  category: { id: number } | number;
  description?: string;
}

const PLACEHOLDER_IMG = 'https://via.placeholder.com/400x250?text=No+Image';
const BASE_URL = 'http://localhost:3001';

export default function CategoryPageClient({ categories }: {
  categories: Category[];
}) {
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);

  // Kategoriye göre çalışmaları fetch et
  useEffect(() => {
    let categoryId = selectedCategory?.id || selectedParent?.id;
    setLoading(true);
    const url = categoryId
      ? `http://localhost:3001/api/category-images?where[category][equals]=${categoryId}`
      : 'http://localhost:3001/api/category-images';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorks(Array.isArray(data?.docs) ? data.docs : []);
      })
      .catch(() => setWorks([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedParent]);

  // Media objesinden görsel url'sini al
  const getWorkImage = (work: Work) => {
    if (!work?.image) return PLACEHOLDER_IMG;
    if (typeof work.image === 'object') {
      if (work.image.sizes?.thumbnail?.url) {
        return work.image.sizes.thumbnail.url.startsWith('/')
          ? BASE_URL + work.image.sizes.thumbnail.url
          : work.image.sizes.thumbnail.url;
      } else if (work.image.url) {
        return work.image.url.startsWith('/')
          ? BASE_URL + work.image.url
          : work.image.url;
      }
    } else if (typeof work.image === 'string') {
      return work.image.startsWith('/') ? BASE_URL + work.image : work.image;
    }
    return PLACEHOLDER_IMG;
  };

  return (
    <div className="flex min-h-screen w-full">
      <CategorySidebar
        categories={categories}
        selectedParent={selectedParent}
        setSelectedParent={setSelectedParent}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main className="flex-1 p-10 min-h-[400px] flex flex-col">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 dark:text-white">Önceki Hizmetlerimiz</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 flex-1">
          {loading ? (
            <div className="col-span-full py-8 text-lg text-gray-500 dark:text-gray-300">Yükleniyor...</div>
          ) : works.length === 0 ? (
            <div className="col-span-full py-8 text-lg text-gray-500 dark:text-gray-300">Bu kategoriye ait çalışma bulunamadı.</div>
          ) : (
            works.map((work) => (
              <div
                key={work.id}
                className="block bg-white rounded-xl shadow-md p-4 border hover:shadow-xl transition-shadow duration-200 cursor-pointer max-h-[260px] flex flex-col"
              >
                <img
                  src={getWorkImage(work)}
                  alt={work.title}
                  className="w-full h-32 object-cover rounded-lg mb-2 border max-h-[130px]"
                  loading="lazy"
                />
                <div className="font-semibold text-gray-800 dark:text-white text-base truncate line-clamp-1">{work.title}</div>
                {work.description && (
                  <div className="text-gray-500 dark:text-gray-300 text-sm mt-1 line-clamp-2">{work.description}</div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 