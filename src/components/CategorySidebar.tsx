"use client";
import React from "react";

interface Category {
  id: number;
  title: string;
  parent?: number | null | { id: number; title: string };
}

interface CategorySidebarProps {
  categories: Category[];
  selectedParent: Category | null;
  setSelectedParent: (cat: Category | null) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedParent,
  setSelectedParent,
  selectedCategory,
  setSelectedCategory,
}) => {
  // Belirli bir ana kategorinin alt kategorilerini döndüren fonksiyon
  function subCategoriesOf(parent: Category): Category[] {
    return categories.filter(cat => {
      if (typeof cat.parent === 'object' && cat.parent !== null) {
        return cat.parent.id === parent.id;
      }
      if (typeof cat.parent === 'number') {
        return cat.parent === parent.id;
      }
      return false;
    });
  }

  // Ana kategoriler (parent'ı olmayanlar veya başka bir kategorinin parent'ı olanlar)
  let parentCategories = categories.filter(cat => {
    if (!cat.parent || cat.parent === null) return true;
    const isParent = categories.some(c => {
      if (typeof c.parent === 'object' && c.parent !== null) {
        return c.parent.id === cat.id;
      }
      if (typeof c.parent === 'number') {
        return c.parent === cat.id;
      }
      return false;
    });
    return isParent;
  });
  parentCategories = parentCategories.filter((cat, idx, arr) => arr.findIndex(c => c.id === cat.id) === idx);

  return (
    <aside className="w-64 bg-white border-r p-6">
      <h2 className="text-xl font-bold mb-6">Kategoriler</h2>
      <ul>
        <li className="mb-2">
          <button
            className={`block w-full text-left py-1 px-2 rounded ${!selectedParent && !selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
            onClick={() => { setSelectedParent(null); setSelectedCategory(null); }}
          >
            Tümü
          </button>
        </li>
        {parentCategories.map(parent => (
          <li key={parent.id} className="mb-2">
            {subCategoriesOf(parent).length > 0 ? (
              <details open={selectedParent?.id === parent.id}>
                <summary
                  className={`cursor-pointer font-semibold ${selectedParent?.id === parent.id ? 'text-indigo-600' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    if (selectedParent?.id === parent.id) {
                      setSelectedParent(null);
                    } else {
                      setSelectedParent(parent);
                      setSelectedCategory(null);
                    }
                  }}
                  style={{ userSelect: 'none' }}
                >
                  {parent.title}
                </summary>
                <ul className="ml-4 mt-2">
                  {subCategoriesOf(parent).map((sub) => (
                    <li key={sub.id}>
                      <button
                        className={`block w-full text-left py-1 px-2 rounded ${selectedCategory?.id === sub.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                        onClick={() => {
                          setSelectedParent(parent);
                          setSelectedCategory(sub);
                        }}
                      >
                        {sub.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <button
                className={`block w-full text-left py-1 px-2 rounded ${selectedCategory?.id === parent.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setSelectedParent(null);
                  setSelectedCategory(parent);
                }}
              >
                {parent.title}
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar; 