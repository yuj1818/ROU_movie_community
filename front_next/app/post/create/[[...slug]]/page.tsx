import PostCreationForm from '@/components/post/PostCreationForm';

export default async function PostCreatePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const movieId = slug ? Number(slug[0]) : undefined;

  return (
    <div className="w-4/5 flex flex-col gap-4 py-12">
      <PostCreationForm movieId={movieId} isEdit={false} />
    </div>
  );
}
