import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium monday-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-monday-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-monday-purple text-white hover:bg-monday-purple-dark hover:shadow-md active:scale-95',
        destructive: 'bg-monday-red text-white hover:bg-[#C73648] hover:shadow-md active:scale-95',
        outline: 'border-2 border-monday-purple bg-white text-monday-purple hover:bg-monday-purple-light active:scale-95',
        secondary: 'bg-monday-purple-light text-monday-purple hover:bg-[#D1D1FF] active:scale-95',
        ghost: 'hover:bg-monday-purple-light hover:text-monday-purple active:scale-95 shadow-none',
        link: 'text-monday-purple underline-offset-4 hover:underline shadow-none',
        success: 'bg-monday-green text-white hover:bg-[#00A961] hover:shadow-md active:scale-95',
        warning: 'bg-monday-orange text-white hover:bg-[#E66A45] hover:shadow-md active:scale-95',
      },
      size: {
        default: 'h-10 px-6 py-2.5',
        sm: 'h-8 rounded-lg px-4 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
