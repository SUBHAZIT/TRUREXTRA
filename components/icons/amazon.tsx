import type * as React from "react"

export function AmazonIcon({
  title = "AMAZON",
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg viewBox="0 0 256 256" role="img" aria-label={title} className={className} {...props}>
      <title>{title}</title>
      {/* Smile curve */}
      <path
        d="M40 160c40 36 136 36 176 0"
        fill="none"
        stroke="currentColor"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow head */}
      <path
        d="M192 148l28 18-20 26"
        fill="none"
        stroke="currentColor"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
