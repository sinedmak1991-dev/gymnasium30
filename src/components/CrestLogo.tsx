import React, { useId } from 'react';

interface CrestLogoProps {
  variant?: 'header' | 'footer';
  className?: string;
}

const STRAIGHT_RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const WAVY_RAY_ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

export const CrestLogo: React.FC<CrestLogoProps> = ({
  variant = 'header',
  className = 'w-full h-full drop-shadow-sm',
}) => {
  const isFooter = variant === 'footer';
  const uid = useId().replace(/:/g, '');
  const sunDiskGradId = `podillia-sun-disk-${uid}`;
  const sunRayGradId = `podillia-sun-ray-${uid}`;

  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Герб Гімназії № 30"
      role="img"
    >
      <defs>
        <radialGradient id={sunDiskGradId} cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFF1BD" />
          <stop offset="38%" stopColor="#F2D27A" />
          <stop offset="76%" stopColor="#E2B857" />
          <stop offset="100%" stopColor="#C4932E" />
        </radialGradient>
        <linearGradient id={sunRayGradId} x1="0" y1="-18.5" x2="0" y2="-7.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5DC8E" />
          <stop offset="55%" stopColor="#E2B857" />
          <stop offset="100%" stopColor="#C89B3C" />
        </linearGradient>
      </defs>

      {/* Основний щит */}
      <path
        d="M12 16C38 8 82 8 108 16V68C108 102 82 122 60 132C38 122 12 102 12 68V16Z"
        fill={isFooter ? '#0E261E' : '#163A2E'}
        stroke="#E2B857"
        strokeWidth="4.5"
      />
      {/* Права половина щита для легкого геральдичного об'єму */}
      <path
        d="M60 10C83 10 108 16 108 16V68C108 102 82 122 60 132V10Z"
        fill={isFooter ? '#163A2E' : '#112E24'}
        fillOpacity="0.45"
      />
      {/* Внутрішня золота рамка */}
      <path
        d="M18 21C40 14 80 14 102 21V67C102 97 79 115 60 124C41 115 18 97 18 67V21Z"
        stroke="#E2B857"
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />

      {/* Золоте Подільське сонце (16 променів: 8 прямих загострених і 8 хвилястих) */}
      <g transform="translate(60 39)">
        {/* 8 прямих загострених променів */}
        {STRAIGHT_RAY_ANGLES.map((angle) => (
          <path
            key={`straight-${angle}`}
            d="M0 -18.5L1.85 -7.5L-1.85 -7.5Z"
            fill={`url(#${sunRayGradId})`}
            transform={`rotate(${angle})`}
          />
        ))}
        {/* 8 хвилястих (полум'яподібних) променів */}
        {WAVY_RAY_ANGLES.map((angle) => (
          <path
            key={`wavy-${angle}`}
            d="M-1.6 -7.5C-2.6 -9.6 -2.5 -11.4 -1.0 -13.0C0.3 -14.4 0.7 -15.9 0 -17.8C1.4 -15.9 1.7 -14.2 0.6 -12.8C-0.4 -11.5 -0.3 -9.8 1.6 -7.5Z"
            fill={`url(#${sunRayGradId})`}
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Центральний золотий диск сонця з градієнтом */}
        <circle
          cx="0"
          cy="0"
          r="8.4"
          fill={`url(#${sunDiskGradId})`}
          stroke={isFooter ? '#0E261E' : '#163A2E'}
          strokeWidth="1"
        />
        <circle
          cx="0"
          cy="0"
          r="6.6"
          stroke="#FFF4CC"
          strokeOpacity="0.45"
          strokeWidth="0.7"
        />
      </g>

      {/* Лівий колосок */}
      <path
        d="M36 96C26 84 24 68 28 52"
        stroke="#E2B857"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="25" cy="60" rx="2.5" ry="5" transform="rotate(-25 25 60)" fill="#E2B857" />
      <ellipse cx="24" cy="70" rx="2.5" ry="5" transform="rotate(-35 24 70)" fill="#E2B857" />
      <ellipse cx="26" cy="80" rx="2.5" ry="5" transform="rotate(-45 26 80)" fill="#E2B857" />
      <ellipse cx="32" cy="57" rx="2.5" ry="5" transform="rotate(20 32 57)" fill="#E2B857" />
      <ellipse cx="31" cy="67" rx="2.5" ry="5" transform="rotate(15 31 67)" fill="#E2B857" />
      <ellipse cx="32" cy="77" rx="2.5" ry="5" transform="rotate(10 32 77)" fill="#E2B857" />

      {/* Правий колосок */}
      <path
        d="M84 96C94 84 96 68 92 52"
        stroke="#E2B857"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="95" cy="60" rx="2.5" ry="5" transform="rotate(25 95 60)" fill="#E2B857" />
      <ellipse cx="96" cy="70" rx="2.5" ry="5" transform="rotate(35 96 70)" fill="#E2B857" />
      <ellipse cx="94" cy="80" rx="2.5" ry="5" transform="rotate(45 94 80)" fill="#E2B857" />
      <ellipse cx="88" cy="57" rx="2.5" ry="5" transform="rotate(-20 88 57)" fill="#E2B857" />
      <ellipse cx="89" cy="67" rx="2.5" ry="5" transform="rotate(-15 89 67)" fill="#E2B857" />
      <ellipse cx="88" cy="77" rx="2.5" ry="5" transform="rotate(-10 88 77)" fill="#E2B857" />

      {/* Розгорнута книга в центрі */}
      <path
        d="M36 86C44 82 54 83 60 88C66 83 76 82 84 86L81 64C74 61 65 62 60 66C55 62 46 61 39 64L36 86Z"
        fill="#F8F9F5"
        stroke="#E2B857"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="60" y1="66" x2="60" y2="88" stroke="#163A2E" strokeWidth="1.8" />
      <line
        x1="43"
        y1="69"
        x2="55"
        y2="70"
        stroke="#163A2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="43"
        y1="74"
        x2="55"
        y2="75"
        stroke="#E2B857"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="79"
        x2="55"
        y2="80"
        stroke="#163A2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="65"
        y1="70"
        x2="77"
        y2="69"
        stroke="#163A2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="65"
        y1="75"
        x2="77"
        y2="74"
        stroke="#E2B857"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="65"
        y1="80"
        x2="78"
        y2="79"
        stroke="#163A2E"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* Цифра 30 внизу */}
      <text
        x="60"
        y="112"
        textAnchor="middle"
        fill="#E2B857"
        fontFamily="Manrope, sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="0.5"
      >
        30
      </text>
    </svg>
  );
};
