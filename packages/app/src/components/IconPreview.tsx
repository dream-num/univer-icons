import React, { useId } from 'react'
import type { IconEntry } from '../catalogue.ts'
import { scopeSvgIds } from '../svg-catalogue.ts'

export function IconPreview({
  className,
  icon,
  size,
}: {
  className?: string
  icon: IconEntry
  size?: number
}) {
  const id = useId()

  return (
    <span
      aria-label={icon.name}
      className={
        className
          ? `inline-flex leading-none [&_svg]:block [&_svg]:h-[1em] [&_svg]:w-[1em] ${className}`
          : 'inline-flex leading-none [&_svg]:block [&_svg]:h-[1em] [&_svg]:w-[1em]'
      }
      dangerouslySetInnerHTML={{ __html: scopeSvgIds(icon.svg, id) }}
      data-icon-preview='true'
      role='img'
      style={{ fontSize: size ?? 'var(--icon-size)' }}
    />
  )
}
