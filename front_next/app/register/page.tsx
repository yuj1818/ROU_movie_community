import RegisterForm from '@/components/auth/RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ isSocial?: boolean }>;
}) {
  const { isSocial } = await searchParams;
  return (
    <div className="p-8 flex-1 w-full flex justify-center items-center">
      <RegisterForm isSocial={isSocial || false} />
    </div>
  );
}
