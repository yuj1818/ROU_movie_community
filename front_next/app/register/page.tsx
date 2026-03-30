import RegisterForm from '@/components/auth/RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ isSocial?: string; email?: string; uid?: string }>;
}) {
  const { isSocial, email, uid } = await searchParams;
  return (
    <div className="p-8 flex-1 w-full flex justify-center items-center">
      <RegisterForm isSocial={isSocial === 'true'} email={email} uid={uid} />
    </div>
  );
}
