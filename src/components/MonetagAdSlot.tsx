import React, { useEffect, useRef } from 'react';
import { AdPlacement } from '../types';

interface MonetagAdSlotProps {
  placement?: AdPlacement;
  slotName: string;
  className?: string;
}

export const MonetagAdSlot: React.FC<MonetagAdSlotProps> = ({ placement, slotName, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // If disabled or empty: DO NOT RENDER ANYTHING (prevents empty broken boxes!)
  if (!placement || !placement.enabled || !placement.code || !placement.code.trim()) {
    return null;
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const rawCode = placement.code.trim();

    // Safely evaluate scripts or HTML provided by Monetag
    try {
      const fragment = document.createRange().createContextualFragment(rawCode);
      container.appendChild(fragment);

      // Re-run script tags if browser didn't automatically execute
      const scripts = container.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    } catch (err) {
      console.warn(`[Monetag Ad Slot: ${slotName}] script render error:`, err);
    }
  }, [placement?.code, slotName]);

  return (
    <div className={`my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <span className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold mb-1">
        ADVERTISEMENT
      </span>
      <div
        ref={containerRef}
        data-ad-slot={slotName}
        className="w-full flex items-center justify-center min-h-[50px] bg-slate-900/40 rounded-lg p-2 border border-slate-800/60"
      />
    </div>
  );
};
