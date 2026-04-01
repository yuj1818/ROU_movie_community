import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  Pagination as PaginationWrapper,
  PaginationButton,
  PaginationContent,
  PaginationItem,
} from '../ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  prev: () => void;
  next: () => void;
  onPageChange: (p: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  prev,
  next,
  onPageChange,
}: PaginationProps) {
  const MAX_VISIBLE = 5;

  let start = Math.max(currentPage - Math.floor(MAX_VISIBLE / 2), 1);
  let end = start + MAX_VISIBLE - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - MAX_VISIBLE + 1, 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <PaginationWrapper>
      <PaginationContent>
        <PaginationItem>
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft />
          </PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton onClick={prev} disabled={currentPage === 1}>
            <ChevronLeft />
          </PaginationButton>
        </PaginationItem>
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationButton
              onClick={() => onPageChange(p)}
              isActive={currentPage === p}
            >
              {p}
            </PaginationButton>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationButton
            onClick={next}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight />
          </PaginationButton>
        </PaginationItem>
      </PaginationContent>
    </PaginationWrapper>
  );
}
