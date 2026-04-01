import { authOptions } from '@/auth';
import PostList from '@/components/post/PostList';
import SortSelect from '@/components/post/SortSelect';
import { Button } from '@/components/ui/button';
import { getPostList } from '@/lib/server/post';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function PostListPage() {
  const queryClient = new QueryClient();
  const session = await getServerSession(authOptions);

  await queryClient.prefetchQuery({
    queryKey: ['posts', 1, 'recent'],
    queryFn: () => getPostList(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-4/5 py-12 h-full flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">ROU 커뮤니티</h1>
          <div className="flex gap-4 items-center">
            <SortSelect />
            {session?.user && (
              <Button>
                <Link href="/post/create">새글 작성</Link>
              </Button>
            )}
          </div>
        </div>
        <PostList />
      </div>
    </HydrationBoundary>
  );
}
