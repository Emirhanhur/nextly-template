"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductClient() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/products")
      .then(res => setProducts(res.data.docs || []))
      .catch(() => setError("Ürünler yüklenemedi"));
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
