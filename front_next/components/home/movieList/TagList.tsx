'use client';

import { Badge } from '@/components/ui/badge';
import { TAGS } from '@/constants/category';
import { useTagStore } from '@/stores/useTagStore';
import { CircleChevronRight, CircleX } from 'lucide-react';
import { useState } from 'react';

export default function TagList() {
  const { selectedTag, selectTag } = useTagStore();
  const [isTagOpen, setIsTagOpen] = useState(false);

  return (
    <div className="w-11/12 flex flex-wrap gap-2 items-center sticky top-4 z-10">
      <Badge
        variant={selectedTag === 20 ? 'default' : 'muted'}
        onClick={() => selectTag(20)}
      >
        TOP 30
      </Badge>
      {isTagOpen
        ? TAGS.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.id ? 'default' : 'muted'}
              onClick={() => selectTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))
        : TAGS.slice(0, 4).map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.id ? 'default' : 'muted'}
              onClick={() => selectTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
      {isTagOpen ? (
        <CircleX
          className="size-5 cursor-pointer"
          onClick={() => setIsTagOpen(false)}
        />
      ) : (
        <CircleChevronRight
          className="size-5 cursor-pointer"
          onClick={() => setIsTagOpen(true)}
        />
      )}
    </div>
  );
}
