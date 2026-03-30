import ProfileBox from '@/components/profile/ProfileBox';
import InfoTabs from '@/components/profile/info/InfoTabs';
import { getProfileInfo } from '@/lib/server/profile';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfileInfo(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full flex flex-col gap-8 md:h-full md:max-h-full md:grid md:grid-cols-3 md:gap-8 px-8 py-4">
        <ProfileBox />
        <div className="w-full p-4 rounded-md border bg-white/10 max-md:h-150 md:col-span-2 md:w-full md:flex-1 md:min-h-0">
          <InfoTabs />
        </div>
      </div>
    </HydrationBoundary>
  );
}
