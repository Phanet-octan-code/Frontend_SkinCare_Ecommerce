import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  wishlistedIds = new Set(),
  onWishlistChange,
  columns = 5,
}) {
  if (!products.length) return null;

  const colClasses =
    columns === 5
      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      : columns === 4
      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : columns === 3
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

  return (
    <div
      className={`product-grid w-full ${colClasses} gap-4 sm:gap-5 lg:gap-6 items-stretch`}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          initialWishlisted={wishlistedIds.has(product.id)}
          onWishlistChange={onWishlistChange}
        />
      ))}
    </div>
  );
}
