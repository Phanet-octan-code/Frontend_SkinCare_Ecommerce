import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Image slot */}
      <div className="skeleton w-full aspect-[4/5] sm:aspect-square bg-[#F4F1EA] mb-3" />

      {/* Product Name */}
      <div className="skeleton w-3/4 h-3.5 rounded-none bg-[#ECE8DE] mb-1.5" />

      {/* Subtitle */}
      <div className="skeleton w-full h-2.5 rounded-none bg-[#F0EDE6] mb-1" />
      <div className="skeleton w-2/3 h-2.5 rounded-none bg-[#F0EDE6] mb-2" />

      {/* Stars */}
      <div className="skeleton w-1/3 h-2.5 rounded-none bg-[#ECE8DE] mb-3" />

      {/* Pricing & Add to Bag footer */}
      <div className="mt-auto pt-1 flex items-center justify-between">
        <div className="skeleton w-14 h-4 rounded-none bg-[#ECE8DE]" />
        <div className="skeleton w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1F2520]/10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10, columns = 5 }) {
  const colClasses =
    columns === 5
      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`w-full ${colClasses} gap-4 sm:gap-5 lg:gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 py-6 sm:py-8">
      {/* Left Gallery Skeleton */}
      <div className="lg:col-span-6 flex flex-col gap-3">
        <div className="skeleton w-full aspect-square rounded-2xl bg-[#F7F5F0]" />
        <div className="grid grid-cols-4 gap-3 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-xl bg-[#F7F5F0]" />
          ))}
        </div>
      </div>

      {/* Right Product Details Skeleton */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {/* Brand Tag */}
        <div className="skeleton w-1/4 h-3.5 rounded-full" />

        {/* Product Title */}
        <div className="skeleton w-4/5 h-8 sm:h-10 rounded-lg" />

        {/* Reviews rating */}
        <div className="skeleton w-1/3 h-4 rounded-full" />

        {/* Price box */}
        <div className="skeleton w-2/5 h-9 rounded-lg mt-2" />

        {/* Volume / size chips */}
        <div className="skeleton w-1/2 h-7 rounded-full mt-2" />

        {/* Formulation description */}
        <div className="skeleton w-full h-24 rounded-2xl mt-3" />

        {/* Purchase Controls */}
        <div className="skeleton w-full h-12 rounded-full mt-4" />

        {/* Guarantee Banner */}
        <div className="skeleton w-full h-24 rounded-2xl mt-4" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white border border-[#ECE8DE] p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex justify-between items-center pb-3 border-b border-[#ECE8DE]/60">
        <div className="skeleton w-1/3 h-4 rounded-md" />
        <div className="skeleton w-1/4 h-6 rounded-full" />
      </div>
      <div className="flex gap-4 items-center">
        <div className="skeleton w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton w-3/4 h-4 rounded-md" />
          <div className="skeleton w-1/4 h-3 rounded-md" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton w-1/4 h-5 rounded-md" />
        <div className="skeleton w-1/4 h-8 rounded-full" />
      </div>
    </div>
  );
}

export default ProductGridSkeleton;
