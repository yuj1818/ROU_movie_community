import ProfileBox from '@/components/profile/ProfileBox';
import { getProfileInfo } from '@/lib/server/profile';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const profileInfo = await getProfileInfo(userId);

  return (
    <div className="w-full flex flex-col gap-8 md:h-full md:grid md:grid-cols-3 md:gap-8 px-8 py-4">
      <ProfileBox initialData={profileInfo} />
    </div>
  );
}
