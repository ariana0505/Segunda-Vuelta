import type { ReactNode, SVGProps } from 'react'

type IconName = 'search' | 'arrow' | 'plus' | 'close' | 'upload' | 'heart' | 'back' | 'check' | 'menu' | 'swap'
type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number }

export function Icon({ name, size = 20, ...props }: Props) {
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    close: <><path d="M5 5l14 14M19 5 5 19" /></>,
    upload: <><path d="M12 16V4m0 0-4 4m4-4 4 4" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
    heart: <path d="M20 8.5c0 4.5-8 10-8 10S4 13 4 8.5a4.5 4.5 0 0 1 8-2.7 4.5 4.5 0 0 1 8 2.7Z" />,
    back: <><path d="M20 12H5" /><path d="m11 6-6 6 6 6" /></>,
    check: <path d="m4 12 5 5L20 6" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    swap: <><path d="M4 8h16m0 0-4-4m4 4-4 4" /><path d="M20 16H4m0 0 4-4m-4 4 4 4" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  )
}
