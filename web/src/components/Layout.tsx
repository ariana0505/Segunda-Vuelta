import type { ReactNode } from 'react'
import type { View } from '../types'
import { Header } from './Header'
import { Footer } from './Footer'

interface Props {
  children: ReactNode
  view: View
  onNavigate: (view: View) => void
  pendingCount: number
}

export function Layout({ children, view, onNavigate, pendingCount }: Props) {
  return <div className="app-shell">
    <div className="demo-banner"><span className="demo-dot" /> DEMO INTERACTIVA <span className="banner-divider">·</span> Los datos son de ejemplo y se reinician al recargar.</div>
    <Header view={view} onNavigate={onNavigate} pendingCount={pendingCount} />
    {children}
    <Footer />
  </div>
}
