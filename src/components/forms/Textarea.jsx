import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    name,
    error,
    helperText,
    rows = 3,
    required = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label text-xs font-semibold text-[#1F2520] mb-1.5 block">
          {label} {required && <span className="text-[#C55A48]">*</span>}
        </label>
      )}

      <div className={error ? 'input-shake' : ''}>
        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          className={`form-textarea w-full rounded-xl bg-white border text-xs sm:text-sm text-[#1F2520] transition-all duration-200 outline-none p-3.5 ${
            error
              ? 'border-[#C55A48] focus:border-[#C55A48] focus:ring-2 focus:ring-[#C55A48]/20 bg-[#FFFDFD]'
              : 'border-[#ECE8DE] focus:border-[#71856B] focus:ring-2 focus:ring-[#71856B]/20'
          }`}
          style={{ resize: 'vertical' }}
          aria-invalid={Boolean(error)}
          required={required}
          {...props}
        />
      </div>

      {error ? (
        <div className="form-error flex items-center gap-1.5 text-xs text-[#C55A48] mt-1.5 font-medium animate-[slideDown_0.18s_cubic-bezier(0.16,1,0.3,1)]">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div className="form-help text-[11px] text-[#8C9388] mt-1.5">{helperText}</div>
      ) : null}
    </div>
  );
});

export default Textarea;
