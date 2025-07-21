"use client";
import React, { useState } from "react";
import { useCart } from "./CartContext";

interface Measurement {
  id: number;
  value: string;
  unit: string;
  price: number;
}

export default function ProductMeasurementsClient({
  measurements,
  selectedMeasurementId,
  onMeasurementChange,
  selectedAttributes,
  totalPrice,
  imageUrl,
  productId,
  productName, // yeni eklendi
}: {
  measurements: Measurement[];
  selectedMeasurementId: number | null;
  onMeasurementChange: (id: number) => void;
  selectedAttributes?: { [key: string]: string };
  totalPrice?: number;
  imageUrl?: string;
  productId: number;
  productName: string; // yeni eklendi
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const selectedMeasurement = measurements.find((m) => m.id === selectedMeasurementId);

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const { addToCart } = useCart();

  // Ölçü yoksa, ürünün fiyatı ve bilgileriyle sepete ekle
  const handleAddToCart = () => {
    console.log("handleAddToCart çalıştı");
    if (added) return;
    if (!productId) {
      alert("Ürün id'si bulunamadı!");
      return;
    }
    // Ürün adı ve ölçü birleştir
    const name = (productName ? productName : "Ürün") + (selectedMeasurement ? ` (${selectedMeasurement.value} ${selectedMeasurement.unit})` : "");
    const measurementId = selectedMeasurement ? selectedMeasurement.id : 0;
    const measurementLabel = selectedMeasurement
      ? selectedMeasurement.value + ' ' + selectedMeasurement.unit
      : '';
    const price = totalPrice !== undefined
      ? totalPrice
      : selectedMeasurement
        ? selectedMeasurement.price
        : 0;
    addToCart({
      id: Date.now(),
      name,
      measurementId,
      measurementLabel,
      price,
      quantity,
      imageUrl: imageUrl || '',
      attributes: selectedAttributes,
      total: price * quantity,
      productId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div>
      {/* Ölçü varsa göster, yoksa gizle */}
      {measurements.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {measurements.map((m) => (
            <label key={m.id} className="flex items-center gap-2">
              <input
                type="radio"
                value={m.id}
                name="default-radio"
                checked={selectedMeasurementId === m.id}
                onChange={() => onMeasurementChange(m.id)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span>
                {m.value} {m.unit}
              </span>
            </label>
          ))}
        </div>
      )}
      {/* Adet seçici */}
      <div className="flex items-center gap-3 mt-4">
        <span className="font-medium">Adet:</span>
        <button
          type="button"
          onClick={handleDecrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          -
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-16 text-center border rounded px-2 py-1"
        />
        <button
          type="button"
          onClick={handleIncrease}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>
      <div className="text-3xl font-extrabold text-indigo-600 mt-4">
        {selectedMeasurement ? (
          <span>
            <span className="ml-2 text-indigo-600 font-bold">
              {(totalPrice !== undefined ? totalPrice : selectedMeasurement.price) * quantity}₺
            </span>
            {quantity > 1 && (
              <span className="ml-2 text-base text-gray-500 font-normal">
                ({totalPrice !== undefined ? totalPrice : selectedMeasurement.price}₺ x {quantity})
              </span>
            )}
          </span>
        ) : (
          <span>Fiyat yok</span>
        )}
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`mt-4 px-4 py-2 rounded font-bold transition-all duration-300
          ${added ? 'bg-green-500 scale-105' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        disabled={added}
      >
        {added ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Sepete Eklendi!
          </span>
        ) : (
          'Sepete Ekle'
        )}
      </button>
    </div>
  );
} 