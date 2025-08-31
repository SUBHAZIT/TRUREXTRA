import { AmazonIcon } from "@/components/icons/amazon"

// Simple, accessible, monochrome brand marks that inherit currentColor.
// Keep icons visually balanced at 24–28px height in a consistent row.
export function BrandLogos({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 text-white/70 ${className}`}
      aria-label="Trusted by industry leaders"
    >
      {/* MICROSOFT */}
      <figure className="flex flex-col items-center gap-2" aria-label="MICROSOFT" title="MICROSOFT">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">
          <rect x="0" y="0" width="10" height="10" rx="1" />
          <rect x="14" y="0" width="10" height="10" rx="1" />
          <rect x="0" y="14" width="10" height="10" rx="1" />
          <rect x="14" y="14" width="10" height="10" rx="1" />
        </svg>
        <figcaption className="text-[10px] md:text-xs tracking-wider font-medium text-white/80">MICROSOFT</figcaption>
      </figure>

      {/* GOOGLE */}
      <figure className="flex flex-col items-center gap-2" aria-label="GOOGLE" title="GOOGLE">
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true" role="img">
          <path
            d="M43.6 24.5c0-1.3-.1-2.5-.3-3.6H24v6.5h11.1c-.3 1.9-1.6 4.4-4.1 6.2l5.9 4.5c3.7-3.4 5.7-8.3 5.7-13.6z"
            fill="currentColor"
          />
          <path
            d="M24 44c5.9 0 10.8-1.9 14.4-5.1l-6.9-5.3c-1.9 1.3-4.3 2.2-7.5 2.2-5.7 0-10.5-3.8-12.2-9l-6.7 5.8C8 39.7 15.4 44 24 44z"
            fill="currentColor"
            opacity=".75"
          />
          <path
            d="M11.8 26.8c-.5-1.4-.7-2.8-.7-4.3s.2-2.9.6-4.3l-6.8-5.2A20 20 0 0 0 4 24c0 3.2.8 6.2 2.3 8.7l5.5-4.2z"
            fill="currentColor"
            opacity=".55"
          />
          <path
            d="M24 10.8c4.1 0 6.8 1.7 8.4 3.1l6.1-5.9C34.7 4.9 29.9 3 24 3 15.4 3 8 7.3 4.9 14.5l7.5 5.9C9.9 14.7 15.6 10.8 24 10.8z"
            fill="currentColor"
            opacity=".4"
          />
        </svg>
        <figcaption className="text-[10px] md:text-xs tracking-wider font-medium text-white/80">GOOGLE</figcaption>
      </figure>

      {/* AMAZON */}
      <figure className="flex flex-col items-center gap-2" aria-label="AMAZON" title="AMAZON">
        <AmazonIcon className="h-7 w-7" />
        <figcaption className="text-[10px] md:text-xs tracking-wider font-medium text-white/80">AMAZON</figcaption>
      </figure>

      {/* APPLE */}
      <figure className="flex flex-col items-center gap-2" aria-label="APPLE" title="APPLE">
        <svg width="26" height="28" viewBox="0 0 256 315" fill="currentColor" aria-hidden="true" role="img">
          <path d="M213 167c0-39 31-56 32-57-17-25-43-29-52-30-22-2-43 13-53 13s-28-13-46-13c-24 0-47 14-60 36-26 45-7 112 19 148 13 18 28 38 48 37 19-1 26-12 49-12s30 12 50 12 34-18 47-37c15-22 21-44 21-45-1 0-41-16-41-52z" />
          <path d="M167 47c10-12 17-28 16-44-15 1-33 10-43 22-9 11-17 27-16 43 16 1 33-9 43-21z" />
        </svg>
        <figcaption className="text-[10px] md:text-xs tracking-wider font-medium text-white/80">APPLE</figcaption>
      </figure>
    </div>
  )
}

export default BrandLogos
