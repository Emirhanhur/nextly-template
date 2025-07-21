"use client";
import React, { useState } from "react";

interface ProductDetailClientProps {
  product: any;
  measurements: any[];
  imageUrl: string;
}

export default function ProductDetailClient({ product, measurements, imageUrl }: ProductDetailClientProps) {
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(measurements[0]?.id || null);
  const selectedMeasurement = measurements.find(m => m.id === selectedMeasurementId);
  // Fiyat: Ölçü seçiliyse ölçünün fiyatı, yoksa ürünün kendi fiyatı
  const price = selectedMeasurement?.price ?? product.price;

  return (
    <div className="max-w-3xl mx-auto p-8 min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 border flex flex-col md:flex-row gap-8">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full md:w-96 h-64 object-cover rounded-lg border mb-4 md:mb-0"
          loading="lazy"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {product.category && (
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category.title}
                </span>
              )}
              {product.status && (
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${product.status === 'true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.status === 'true' ? 'Aktif' : 'Pasif'}</span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">{product.description}</p>
            {/* Ölçüler */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Ürün Ölçüleri</h2>
              {measurements.length === 0 ? (
                <div className="text-gray-500">Bu ürüne ait ölçü bulunamadı.</div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {measurements.map((m) => (
                    <label key={m.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={m.id}
                        name='default-radio'
                        checked={selectedMeasurementId === m.id}
                        onChange={() => setSelectedMeasurementId(m.id)}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                      />
                      <span>
                        {m.value} {m.unit} {m.description ? `- ${m.description}` : ""} <span className="ml-2 text-indigo-700 font-semibold">₺{m.price}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between mt-4">
            <div className="text-3xl font-extrabold text-indigo-600">₺{price}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 