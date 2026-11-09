import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import catalogService from '../../services/catalogService';

export default function FlashSaleBanner() {
  const [sale, setSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    let mounted = true;
    catalogService
      .getFlashSales()
      .then((sales) => {
        if (mounted && sales && sales.length > 0) {
          // Find first active sale with valid ends_at
          const active = sales.find((s) => s.ends_at && new Date(s.ends_at) > new Date());
          if (active) {
            setSale(active);
          }
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!sale?.ends_at) return;

    const target = new Date(sale.ends_at).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      if (diff === 0) {
        setTimeLeft(null);
        setSale(null);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [sale]);

  if (!sale || !timeLeft) return null;

  return (
    <div className="bg-[#2C2A29] text-[#EDE8DF] py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="bg-[#D9A74A] text-[#2C2A29] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {sale.badge_text || 'LIMITED-TIME OFFER'}
          </span>
          <span className="font-medium text-white">
            {sale.name}: Save {sale.discount_type === 'percentage' ? `${sale.discount_value}%` : `$${sale.discount_value}`}
          </span>
          {sale.code && (
            <span className="text-stone-300 font-mono text-[11px] hidden md:inline">
              Use code <strong className="text-amber-300">{sale.code}</strong>
            </span>
          )}
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-xs">
            <span className="bg-[#1C1A19] px-2 py-0.5 rounded border border-stone-800">{timeLeft.hours}h</span>
            <span>:</span>
            <span className="bg-[#1C1A19] px-2 py-0.5 rounded border border-stone-800">{timeLeft.minutes}m</span>
            <span>:</span>
            <span className="bg-[#1C1A19] px-2 py-0.5 rounded border border-stone-800">{timeLeft.seconds}s</span>
          </div>

          <Link
            to="/shop"
            className="text-white hover:text-amber-300 underline font-medium text-[11px] uppercase tracking-wider"
          >
            Shop Now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

