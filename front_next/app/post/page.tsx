import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PostListPage() {
  return (
    <div className="w-4/5 py-12 h-fit flex gap-6">
      <div className="flex-1 min-w-0 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">ROU 커뮤니티</h1>
          <Button>
            <Link href="/post/create">새글 작성</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
