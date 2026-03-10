'use client';

import { usePostStore } from '@/stores/usePostStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useShallow } from 'zustand/shallow';
import { SortKey } from '@/types/post';

export default function SortSelect() {
  const { sort, setSort } = usePostStore(
    useShallow((state) => ({
      sort: state.sort,
      setSort: state.setSort,
    })),
  );

  return (
    <Select value={sort} onValueChange={(v: SortKey) => setSort(v)}>
      <SelectTrigger className="rounded-lg border text-sm w-25">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="recent">최신순</SelectItem>
        <SelectItem value="likeDesc">좋아요 ↓</SelectItem>
        <SelectItem value="commentDesc">댓글 ↓</SelectItem>
      </SelectContent>
    </Select>
  );
}
