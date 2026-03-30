import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const titleVariants = cva('font-sans', {
  variants: {
    size: {
      sm: 'text-lg',
      default: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
    },
    color: {
      default: 'text-white',
      black: 'text-black',
      primary: 'text-primary',
    },
    weight: {
      default: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'default',
    color: 'default',
    weight: 'default',
  },
});

export default function Title({
  className,
  children,
  size = 'default',
  color = 'default',
  weight = 'default',
}: React.ComponentProps<'h3'> & VariantProps<typeof titleVariants>) {
  return (
    <h3 className={cn(titleVariants({ size, color, weight }), className)}>
      {children}
    </h3>
  );
}
