interface FormfieldProps {
  label: string;
  htmlFor?: string;
  children?: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  children,
}: FormfieldProps) {
  return (
    <div className="flex flex-col w-full gap-1 scheme-dark">
      <label htmlFor={htmlFor} className="text-sm">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}
