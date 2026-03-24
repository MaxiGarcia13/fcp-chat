import type { SVGProps } from 'react'
import { cn } from '@/utils/classes'

export function StopIcon({ className, ...props }: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn('size-6', className)}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M7 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Z" />
    </svg>
  )
}
