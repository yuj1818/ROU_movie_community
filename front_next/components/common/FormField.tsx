import { cn } from '@/lib/utils';

interface FormfieldProps {
  label: string;
  htmlFor?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  children,
  className = '',
}: FormfieldProps) {
  return (
    <div className={cn('flex flex-col w-full gap-1 scheme-dark', className)}>
      <label htmlFor={htmlFor} className="text-sm">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}
