import React from 'react';

/**
 * Creative Bharat Hand-Drawn & Startup Vector Decorations
 * Lightweight, accessible (aria-hidden), purely decorative.
 */

// 1. Curved Hand-Drawn Underline Stroke
export function CurvedUnderline({
  color = '#F47721',
  width = '100%',
  height = 12,
  className = '',
}) {
  return (
    <svg
      className={`pointer-events-none absolute left-0 -bottom-2 overflow-visible ${className}`}
      style={{ width }}
      height={height}
      viewBox="0 0 160 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M2 9.5C38 3 85 2.5 158 8C110 5.5 60 7 12 12.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 2. Double Hand-Drawn Wavy Underline
export function WavyUnderline({
  color = '#13865B',
  height = 10,
  className = '',
}) {
  return (
    <svg
      className={`pointer-events-none absolute left-0 -bottom-2 w-full overflow-visible ${className}`}
      height={height}
      viewBox="0 0 140 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M2 6C15 2 28 8 42 5C56 2 70 8 84 5C98 2 112 8 126 5C132 4 136 5 138 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// 3. Playful 4-Point Sparkle / Spark Shape
export function SparkShape({
  color = '#F47721',
  size = 20,
  className = '',
}) {
  return (
    <svg
      className={`pointer-events-none inline-block shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
    </svg>
  );
}

// 4. Hand-Drawn Curly / Curved Arrow
export function HandDrawnArrow({
  color = '#F47721',
  direction = 'right', // 'right' | 'down' | 'curve-right'
  className = '',
  size = 40,
}) {
  if (direction === 'curve-right') {
    return (
      <svg
        className={`pointer-events-none inline-block ${className}`}
        width={size}
        height={Math.round(size * 0.65)}
        viewBox="0 0 54 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M3 28C14 12 32 5 48 10"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40 5L50 11L44 19"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      className={`pointer-events-none inline-block ${className}`}
      width={size}
      height={Math.round(size * 0.5)}
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 12C16 11 32 12 44 12M36 4L45 12L36 20"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 5. Emphasis Doodle Burst (3 accent lines above a word)
export function DoodleBurst({
  color = '#F47721',
  className = '',
}) {
  return (
    <svg
      className={`pointer-events-none absolute -top-4 -right-3 overflow-visible ${className}`}
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 14L6 9M12 12L12 3M21 14L18 9"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 6. Imperfect Hand-Drawn Circle / Highlight Badge
export function DoodleCircle({
  color = '#F47721',
  children,
  className = '',
}) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 -m-1.5 h-[calc(100%+12px)] w-[calc(100%+12px)] overflow-visible"
        viewBox="0 0 80 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M12 25C10 12 28 5 48 6C68 7 76 18 74 30C72 42 54 46 34 45C16 44 6 34 8 22"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// 7. Soft Watercolor Brush Highlight Blob for Backgrounds
export function BrushHighlight({
  color = '#FFF0E5',
  className = '',
}) {
  return (
    <svg
      className={`pointer-events-none absolute overflow-visible ${className}`}
      viewBox="0 0 200 60"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d="M8 32C32 20 84 14 140 18C176 20 196 26 192 36C186 48 148 52 100 50C48 48 12 46 8 32Z" />
    </svg>
  );
}
