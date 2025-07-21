'use client';
import axios from 'axios';
import { notFound } from 'next/navigation';
import ProductMeasurementsClient from '../../../components/ProductMeasurementsClient';
import ProductAttributesSelector from '../../../components/ProductAttributesSelector';
import React, { useState, useEffect } from 'react';
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import { Container } from "@/components/Container";
import { useCart } from "@/components/CartContext";

const PLACEHOLDER_IMG = 'https://via.placeholder.com/600x400?text=No+Image';
const BASE_URL = 'http://localhost:3001';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: any;
  description?: string;
  status?: string;
  category?: { title: string };
  measurement?: Measurement[];
  attributes?: Attribute[];
}

interface AttributeOption {
  label: string;
  price?: number;
  isDefault?: boolean;
}
interface Attribute {
  id?: string;
  name: string;
  options: AttributeOption[];
}

interface Measurement {
  id: number;
  product: { id: number;[key: string]: any };
  value: string;
  unit: string;
  description?: string;
  price: number;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: any }>({});
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${params.id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Ürün bulunamadı');
      }
      try {
        const res = await axios.get(`${BASE_URL}/api/measurements?where[product][equals]=${params.id}`);
        if (res.data && Array.isArray(res.data.docs)) {
          setMeasurements(res.data.docs);
          if (res.data.docs.length > 0) setSelectedMeasurementId(res.data.docs[0].id);
        }
      } catch (err) {
        // ignore
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  // Toplam fiyatı ölçü ve attribute'a göre hesapla
  useEffect(() => {
    if (!product || !measurements.length || selectedMeasurementId === null) return;
    const selectedMeasurement = measurements.find(m => m.id === selectedMeasurementId);
    let base = selectedMeasurement ? selectedMeasurement.price : product.price;
    let extra = 0;
    Object.values(selectedAttributes).forEach(opt => {
      if (opt && typeof opt.price === 'number') {
        extra += opt.price;
      }
    });
    setTotalPrice(base + extra);
  }, [product, measurements, selectedMeasurementId, selectedAttributes]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!product) return notFound();

  // Görsel url'sini hazırla
  let imageUrl = PLACEHOLDER_IMG;
  if (product.image && typeof product.image === 'object') {
    const imgObj = product.image;
    if (imgObj.sizes && imgObj.sizes.medium && imgObj.sizes.medium.url) {
      imageUrl = imgObj.sizes.medium.url.startsWith('/')
        ? BASE_URL + imgObj.sizes.medium.url
        : imgObj.sizes.medium.url;
    } else if (imgObj.url) {
      imageUrl = imgObj.url.startsWith('/')
        ? BASE_URL + imgObj.url
        : imgObj.url;
    }
  } else if (product.image && typeof product.image === 'string') {
    imageUrl = product.image.startsWith('/')
      ? BASE_URL + product.image
      : product.image;
  }

  return (
    <AnimatedPageWrapper>
      <Container className="max-w-5xl mx-auto p-4 md:p-10 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="bg-white rounded-3xl shadow-2xl p-0 md:p-8 border flex flex-col md:flex-row gap-0 md:gap-12 overflow-hidden">
          {/* Ürün Görseli */}
          <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-100 p-6 md:p-10">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full border-red-50
 m-0 p-0 object-contain rounded-2xl shadow-md border"
              loading="lazy"
            />
          </div>
          {/* Ürün Bilgileri */}
          <div className="md:w-1/2 w-full flex flex-col justify-between p-6 md:p-0">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {product.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category.title}
                  </span>
                )}
                {product.status && (
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${product.status === 'true' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.status === 'true' ? 'Aktif' : 'Pasif'}</span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              <p className="text-gray-700 mb-8 whitespace-pre-line text-base leading-relaxed border-l-4 border-indigo-200 pl-4 bg-indigo-50/30 py-2 rounded">
                {product.description}
              </p>
              {/* Özellikler */}
              {product.attributes && product.attributes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Özellik Seçimi</h2>
                  <ProductAttributesSelector attributes={product.attributes} onSelectionChange={setSelectedAttributes} />
                </div>
              )}
              {/* Ölçüler ve fiyat/adet/sepet */}
              <div className="mt-8">
                <h2            
                 className="text-xl font-bold text-gray-800 mb-4">Ölçü Seçimi</h2>
                {error && (
                  <div className="text-red-500 mb-2">{error}</div>
                )}
                <div className="bg-indigo-50/50 rounded-xl p-4 shadow-inner">
                  <ProductMeasurementsClient
                    measurements={measurements}
                    selectedMeasurementId={selectedMeasurementId}
                    onMeasurementChange={setSelectedMeasurementId}
                    selectedAttributes={selectedAttributes}
                    totalPrice={totalPrice}
                    imageUrl={imageUrl}
                    productId={product.id}
                    productName={product.name}
                  />
                  {measurements.length === 0 && !error && (
                    <div className="text-gray-500 mt-2">Bu ürüne ait ölçü bulunamadı.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </AnimatedPageWrapper>
  );
} 