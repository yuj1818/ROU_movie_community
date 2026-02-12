import { getProfileInfo } from '@/lib/server/profile';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const profileInfo = await getProfileInfo(userId);

  console.log(profileInfo);

  return (
    <div className="w-[90%] py-8 flex justify-around items-center flex-wrap gap-16"></div>
  );
}
