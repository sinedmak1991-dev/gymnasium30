import React, { useEffect, useState } from 'react';
import { CrestLogo } from './CrestLogo';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-forest text-gold p-4 select-none relative overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-16 h-[74px] drop-shadow-sm">
          <CrestLogo variant="header" />
        </div>
        <span className="mt-2 font-heading font-bold text-[11px] uppercase tracking-widest text-gold/90">
          Гімназія № 30
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
