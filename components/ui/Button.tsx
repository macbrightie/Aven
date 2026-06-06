import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-[14px] font-medium font-sans transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-[#1a1a1a] text-white hover:bg-[#333] shadow-sm',
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        destructive: 'border border-red-500/20 text-red-600 hover:bg-red-500/5',
        outline: 'border border-black/15 bg-transparent hover:bg-black/5 text-[#1a1a1a]',
        secondary: 'bg-[#ECE8E2] text-[#1a1a1a] hover:bg-[#E3DDD4]',
        ghost: 'hover:bg-black/5 text-[#1a1a1a]',
        green: 'bg-[#104d3b] text-white hover:bg-[#0d3f30] shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[13px]',
        md: 'px-5 py-2.5 text-base',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
