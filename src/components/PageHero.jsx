import { Link } from 'react-router-dom';

/**
 * Reusable PageHero component for NagrikSetu inner pages.
 * Supports variants:
 * - 'civic': Deep navy background with saffron and tricolor accents
 * - 'dashboard': Warm ivory background with navy typography
 * - 'services': Deep navy background with government emblem style
 * - 'assistant': Saffron & navy conversational banner
 * - 'future-vision': Purple / Deep navy futuristic gradient
 */
export default function PageHero({
  badge = 'Digital Bharat • NagrikSetu',
  badgeIcon = '🇮🇳',
  title,
  subtitle,
  description,
  locationBadge = null,
  primaryAction = null,
  secondaryAction = null,
  variant = 'civic',
  watermark = 'mandala', // 'mandala' | 'infra' | 'nodes' | 'none'
  children,
}) {
  const isLight = variant === 'dashboard';

  const watermarkClass =
    watermark === 'mandala'
      ? 'bg-watermark-mandala'
      : watermark === 'infra'
      ? 'bg-watermark-infra'
      : watermark === 'nodes'
      ? 'bg-watermark-nodes'
      : '';

  return (
    <section
      className={`relative overflow-hidden py-10 sm:py-14 md:py-16 ${
        isLight
          ? 'bg-[#FFF9F1] text-[#1D2939] border-b border-[#E3E8EF]'
          : 'bg-[#0B1F50] text-white shadow-lg'
      }`}
    >
      {/* Top Tricolor Ribbon on dark banners */}
      {!isLight && (
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="w-1/3 bg-[#F47721]" />
          <div className="w-1/3 bg-white" />
          <div className="w-1/3 bg-[#13865B]" />
        </div>
      )}

      {/* Decorative SVG watermark background */}
      {watermark !== 'none' && (
        <div
          className={`absolute inset-0 ${watermarkClass} ${
            isLight ? 'opacity-[0.05]' : 'opacity-[0.08]'
          } pointer-events-none`}
          aria-hidden="true"
        />
      )}

      {/* Ambient background glows for dark hero */}
      {!isLight && (
        <>
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#F47721]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#13865B]/15 blur-3xl" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
          
          {/* Main Hero Content */}
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            {/* Top Badges */}
            <div className="flex items-center flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md ${
                  isLight
                    ? 'bg-white border border-[#F47721]/30 text-[#F47721] shadow-2xs'
                    : 'bg-white/10 border border-white/20 text-[#F47721]'
                }`}
              >
                <span>{badgeIcon}</span>
                <span>{badge}</span>
              </span>

              {locationBadge && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                    isLight
                      ? 'bg-[#EEF4FF] text-[#0B1F50] border border-[#244A85]/20'
                      : 'bg-white/10 text-slate-200 border border-white/15'
                  }`}
                >
                  <span>📍</span>
                  <span>{locationBadge}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
                isLight ? 'text-[#0B1F50]' : 'text-white'
              }`}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p
                className={`text-sm sm:text-base lg:text-lg font-bold tracking-wide ${
                  isLight ? 'text-[#F47721]' : 'text-[#F47721]'
                }`}
              >
                {subtitle}
              </p>
            )}

            {/* Description */}
            {description && (
              <p
                className={`text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl font-medium ${
                  isLight ? 'text-[#596579]' : 'text-slate-200'
                }`}
              >
                {description}
              </p>
            )}

            {/* Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {primaryAction && (
                  primaryAction.to ? (
                    <Link
                      to={primaryAction.to}
                      onClick={primaryAction.onClick}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      {primaryAction.icon && <span>{primaryAction.icon}</span>}
                      <span>{primaryAction.label}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={primaryAction.onClick}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F47721] hover:bg-[#d96617] text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      {primaryAction.icon && <span>{primaryAction.icon}</span>}
                      <span>{primaryAction.label}</span>
                    </button>
                  )
                )}

                {secondaryAction && (
                  secondaryAction.to ? (
                    <Link
                      to={secondaryAction.to}
                      onClick={secondaryAction.onClick}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-black transition-all shadow-xs ${
                        isLight
                          ? 'bg-white hover:bg-slate-50 text-[#0B1F50] border border-[#E3E8EF]'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                      }`}
                    >
                      {secondaryAction.icon && <span>{secondaryAction.icon}</span>}
                      <span>{secondaryAction.label}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={secondaryAction.onClick}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-black transition-all shadow-xs ${
                        isLight
                          ? 'bg-white hover:bg-slate-50 text-[#0B1F50] border border-[#E3E8EF]'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                      }`}
                    >
                      {secondaryAction.icon && <span>{secondaryAction.icon}</span>}
                      <span>{secondaryAction.label}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Optional Right illustration or status container */}
          {children && (
            <div className="shrink-0 w-full lg:w-auto">
              {children}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
