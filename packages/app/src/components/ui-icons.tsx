import React from 'react'

type IconProps = {
  className?: string
}

export function SearchGlyph({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.75}
      viewBox='0 0 16 16'
    >
      <circle cx='7.25' cy='7.25' r='4.75' />
      <path d='m10.75 10.75 3 3' />
    </svg>
  )
}

export function CloseGlyph({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.75}
      viewBox='0 0 16 16'
    >
      <path d='M4 4l8 8M12 4l-8 8' />
    </svg>
  )
}

export function CopyGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <rect height='9' rx='1.5' width='9' x='5.25' y='5.25' />
      <path d='M3.25 10.75h-.5a1.5 1.5 0 0 1-1.5-1.5v-6.5a1.5 1.5 0 0 1 1.5-1.5h6.5a1.5 1.5 0 0 1 1.5 1.5v.5' />
    </svg>
  )
}

export function CheckGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      viewBox='0 0 16 16'
    >
      <path d='M3.25 8.5 6.5 11.75 12.75 4.75' />
    </svg>
  )
}

export function DownloadGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <path d='M8 2.5v7.75m0 0L5.25 7.5M8 10.25 10.75 7.5M2.75 12.25v.5a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1v-.5' />
    </svg>
  )
}

export function SunGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <circle cx='8' cy='8' r='2.75' />
      <path d='M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.58 3.58l1.06 1.06M11.36 11.36l1.06 1.06M12.42 3.58l-1.06 1.06M4.64 11.36l-1.06 1.06' />
    </svg>
  )
}

export function MoonGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <path d='M13.25 9.85A5.5 5.5 0 0 1 6.15 2.75a5.5 5.5 0 1 0 7.1 7.1Z' />
    </svg>
  )
}

export function GridGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      viewBox='0 0 16 16'
    >
      <rect height='11.5' rx='1.5' width='11.5' x='2.25' y='2.25' />
      <path d='M6 2.25v11.5M10 2.25v11.5M2.25 6h11.5M2.25 10h11.5' />
    </svg>
  )
}

export function RotateCcwGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <path d='M2.75 5.75H6.5V2M3.35 10.1a5.25 5.25 0 1 0 .75-5.65L2.75 5.75' />
    </svg>
  )
}

export function SlidersGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <path d='M2.5 4h7.5M12.5 4h1M2.5 8h2.5M7.5 8h6M2.5 12h6.5M11.5 12h2' />
      <circle cx='11.25' cy='4' r='1.25' />
      <circle cx='6.25' cy='8' r='1.25' />
      <circle cx='10.25' cy='12' r='1.25' />
    </svg>
  )
}

export function SparklesGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <path d='m8 2 1.2 3.3L12.5 6.5 9.2 7.7 8 11 6.8 7.7 3.5 6.5l3.3-1.2L8 2Z' />
      <path d='m12.75 10.5.45 1.3 1.3.45-1.3.45-.45 1.3-.45-1.3-1.3-.45 1.3-.45.45-1.3Z' />
    </svg>
  )
}

export function ColumnsGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <rect height='11.5' rx='1.5' width='11.5' x='2.25' y='2.25' />
      <path d='M8 2.25v11.5' />
    </svg>
  )
}

export function LayoutGridGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <rect height='4.5' rx='1' width='4.5' x='2.25' y='2.25' />
      <rect height='4.5' rx='1' width='4.5' x='9.25' y='2.25' />
      <rect height='4.5' rx='1' width='4.5' x='2.25' y='9.25' />
      <rect height='4.5' rx='1' width='4.5' x='9.25' y='9.25' />
    </svg>
  )
}

export function CrosshairGlyph({ className = 'h-3.5 w-3.5' }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.6}
      viewBox='0 0 16 16'
    >
      <circle cx='8' cy='8' r='4.5' />
      <path d='M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2' />
    </svg>
  )
}
