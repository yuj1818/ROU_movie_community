interface FollowListProps {
  followers: number;
  followings: number;
  friends: number;
}

export default function FollowList({
  followers,
  followings,
  friends,
}: FollowListProps) {
  return (
    <div className="w-full grid grid-cols-3 gap-2">
      <div className="w-full flex flex-col gap-1 items-center">
        <span className="text-2xl font-bold">{followers}</span>
        <span className="text-sm">팔로워</span>
      </div>
      <div className="w-full flex flex-col gap-1 items-center">
        <span className="text-2xl font-bold">{followings}</span>
        <span className="text-sm">팔로잉</span>
      </div>
      <div className="w-full flex flex-col gap-1 items-center">
        <span className="text-2xl font-bold">{friends}</span>
        <span className="text-sm">친구</span>
      </div>
    </div>
  );
}
