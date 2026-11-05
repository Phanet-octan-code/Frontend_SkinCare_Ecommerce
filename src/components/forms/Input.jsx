import React, { forwardRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    error,
    helperText,
    icon: Icon,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label text-xs font-semibold text-[#1F2520] mb-1.5 block">
          {label} {required && <span className="text-[#C55A48]">*</span>}
        </label>
      )}

      <div className={`relative flex items-center ${error ? 'input-shake' : ''}`}>
        {Icon && (
          <div className="absolute left-3.5 text-[#8C9388] pointer-events-none flex items-center justify-center">
            <Icon size={17} />
          </div>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type={effectiveType}
          className={`form-input w-full rounded-xl bg-white border text-xs sm:text-sm text-[#1F2520] transition-all duration-200 outline-none ${
            error
              ? 'border-[#C55A48] focus:border-[#C55A48] focus:ring-2 focus:ring-[#C55A48]/20 bg-[#FFFDFD]'
              : 'border-[#ECE8DE] focus:border-[#71856B] focus:ring-2 focus:ring-[#71856B]/20'
          }`}
          style={{
            paddingLeft: Icon ? '40px' : '14px',
            paddingRight: isPassword ? '40px' : '14px',
            paddingTop: '11px',
            paddingBottom: '11px',
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          required={required}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1.5 rounded-full text-[#8C9388] hover:text-[#1F2520] hover:bg-[#FAF9F5] active:scale-90 transition-all cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error ? (
        <div
          id={`${name}-error`}
          className="form-error flex items-center gap-1.5 text-xs text-[#C55A48] mt-1.5 font-medium animate-[slideDown_0.18s_cubic-bezier(0.16,1,0.3,1)]"
        >
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div className="form-help text-[11px] text-[#8C9388] mt-1.5">{helperText}</div>
      ) : null}
    </div>
  );
});

export default Input;
