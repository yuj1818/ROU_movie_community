import { TextareaHTMLAttributes } from 'react';

export default function CommentTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className="flex-1 min-w-0 rounded border border-white bg-muted resize-none outline-none p-2 text-sm"
    />
  );
}
