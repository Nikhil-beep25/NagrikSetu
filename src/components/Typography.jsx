import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CurvedUnderline } from './CreativeDecorations';

/**
 * Creative Bharat Typography Components
 * Uses 5 purposeful fonts:
 * - Bricolage Grotesque (font-display)
 * - Satisfy (font-handwritten)
 * - Outfit (font-body)
 * - Nunito (font-friendly)
 * - Noto Sans Devanagari (font-hindi)
 */

export function AccentWord({
  children,
  color = 'saffron', // 'saffron' | 'green' | 'blue' | 'navy' | string
  underline = true,
  className = '',
}) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const colorClass =
    color === 'saffron'
      ? 'text-[#F47721]'
      : color === 'green'
      ? 'text-[#13865B]'
      : color === 'blue'
      ? 'text-[#2D8CFF]'
      : color === 'navy'
      ? 'text-[#0B1F50]'
      : color.startsWith('#')
      ? ''
      : 'text-[#F47721]';

  const underlineColor =
    color === 'saffron'
      ? '#F47721'
      : color === 'green'
      ? '#13865B'
      : color === 'blue'
      ? '#2D8CFF'
      : '#F47721';

  return (
    <span
      className={`relative inline-block px-1 ${
        isHindi ? 'font-bold font-hindi' : 'font-handwritten text-[1.12em] tracking-normal'
      } ${colorClass} ${className}`}
      style={color.startsWith('#') ? { color } : undefined}
    >
      {children}
      {underline && !isHindi && (
        <CurvedUnderline color={underlineColor} className="-bottom-2" />
      )}
    </span>
  );
}

export function DisplayHeading({
  children,
  as: Component = 'h1',
  className = '',
}) {
  return (
    <Component
      className={`font-display font-extrabold tracking-tight text-[#0B1F50] leading-[1.15] ${className}`}
    >
      {children}
    </Component>
  );
}

export function SectionHeading({
  children,
  as: Component = 'h2',
  className = '',
}) {
  return (
    <Component
      className={`font-display font-extrabold tracking-tight text-[#0B1F50] leading-tight text-2xl sm:text-3xl lg:text-4xl ${className}`}
    >
      {children}
    </Component>
  );
}

export function PageTitle({
  children,
  as: Component = 'h1',
  className = '',
}) {
  return (
    <Component
      className={`font-display font-extrabold tracking-tight text-[#0B1F50] leading-tight text-2xl sm:text-4xl lg:text-5xl ${className}`}
    >
      {children}
    </Component>
  );
}

export function BodyText({
  children,
  as: Component = 'p',
  className = '',
}) {
  return (
    <Component
      className={`font-body font-normal text-[#596579] leading-relaxed ${className}`}
    >
      {children}
    </Component>
  );
}

export function FriendlyLabel({
  children,
  className = '',
}) {
  return (
    <span
      className={`font-friendly font-bold text-xs uppercase tracking-wider ${className}`}
    >
      {children}
    </span>
  );
}
