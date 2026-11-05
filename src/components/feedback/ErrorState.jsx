import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Dispensary Connection Interrupted',
  message = 'We encountered a momentary issue retrieving this formulation data. Please attempt to reconnect.',
  onRetry,
}) {
  return (
    <div className="w-full text-center py-12 sm:py-14 px-6 bg-white rounded-3xl border border-[#F5D5CE] shadow-xs my-6 max-w-lg mx-auto">
      {/* Terracotta Alert Monogram */}
      <div className="w-14 h-14 rounded-full bg-[#FDF0ED] border border-[#F5D5CE] text-[#C55A48] flex items-center justify-center mx-auto mb-4 shadow-2xs">
        <AlertCircle size={26} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1F2520] mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-xs sm:text-sm text-[#5A6358] max-w-sm mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      {/* Retry Action */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#1F2520] text-[#1F2520] hover:bg-[#1F2520] hover:text-white transition-all duration-200 text-xs font-medium tracking-wide active:scale-95 cursor-pointer shadow-xs"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
