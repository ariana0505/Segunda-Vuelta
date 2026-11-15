import type { ReactNode } from 'react'

interface Props {
  kind: 'loading' | 'empty' | 'error'
  title: string
  children?: ReactNode
  action?: ReactNode
}

export function ContentState({ kind, title, children, action }: Props) {
  return <div className="empty-state" role={kind === 'error' ? 'alert' : 'status'}>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
    {action}
  </div>
}
