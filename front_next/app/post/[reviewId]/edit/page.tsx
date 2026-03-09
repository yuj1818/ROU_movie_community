import PostCreationForm from '@/components/post/PostCreationForm';

export default function PostEditPage() {
  return (
    <div className="w-4/5 flex flex-col gap-4 py-12">
      <PostCreationForm isEdit={true} />
    </div>
  );
}
