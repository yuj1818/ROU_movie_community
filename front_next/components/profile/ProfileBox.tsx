'use client';

import { follow, getProfileInfo } from '@/lib/client/profile';
import { UserInfo } from '@/types/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import FollowList from './FollowList';
import PreferenceBox from './preference/PreferenceBox';
import { useModalContext } from '@/contexts/ModalContext';
import ProfileEditForm from './ProfileEditForm';

export default function ProfileBox({ initialData }: { initialData: UserInfo }) {
  const session = useSession();
  const queryClient = useQueryClient();
  const { data: profileInfo, isPending } = useQuery<UserInfo>({
    queryKey: ['profile', initialData.id],
    queryFn: async () => {
      const res = await getProfileInfo(initialData.id);
      return res;
    },
    initialData,
  });
  const isMine = session.data?.user.id === profileInfo.id;
  const { open } = useModalContext();

  const mutation = useMutation({
    mutationFn: () => follow(profileInfo.id),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', profileInfo.id], (old: UserInfo) =>
        old ? { ...old, ...updatedProfile } : old,
      );

      queryClient.invalidateQueries({
        queryKey: ['profile', profileInfo.id, 'relations', 'followers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['profile', profileInfo.id, 'relations', 'friends'],
      });
    },
  });

  const onOpenProfileEditModal = () => {
    open({
      title: '기본 정보 편집',
      content: <ProfileEditForm {...profileInfo} />,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center md:h-full">
      <div className="h-32 rounded-full aspect-square overflow-hidden relative bg-white">
        <Image
          className="object-cover"
          src={
            profileInfo.profile_image
              ? `/api/media/${profileInfo.profile_image}`
              : '/profile.png'
          }
          fill
          sizes="300px"
          alt={`profile_img_${profileInfo.id}`}
        />
      </div>
      <div className="flex gap-2 items-center">
        <span className="font-semibold text-2xl">{profileInfo.nickname}</span>
        {session.status === 'loading' ? (
          <></>
        ) : isMine ? (
          <Pencil
            className="size-4 cursor-pointer"
            onClick={onOpenProfileEditModal}
          />
        ) : (
          <Button
            size="sm"
            variant={profileInfo.isFollowing ? 'secondary' : 'default'}
            onClick={() => mutation.mutate()}
          >
            {profileInfo.isFollowing ? '팔로잉' : '팔로우'}
          </Button>
        )}
      </div>
      <FollowList
        followers={profileInfo.followers_count}
        followings={profileInfo.followings_count}
        friends={profileInfo.friends_count}
      />
      <PreferenceBox isMine={isMine} profileInfo={profileInfo} />
    </div>
  );
}
