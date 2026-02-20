import { InputHTMLAttributes } from 'react';

export default function TextInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      spellCheck={false}
      className="h-8 p-4 w-full rounded border border-input outline-none"
    />
  );
}
