
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        achievement: 
          "w-20 h-20 flex items-center justify-center relative p-0 border-2 rounded-full",
        locked:
          "w-20 h-20 flex items-center justify-center filter grayscale opacity-50 relative p-0 border-2 rounded-full border-gray-300 bg-gray-100",
      },
      state: {
        unlocked: "bg-gradient-to-br from-amber-300 to-amber-500 shadow-lg border-amber-400",
        locked: "bg-gray-200 border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, state, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, state }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
