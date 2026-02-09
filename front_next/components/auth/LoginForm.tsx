export default function LoginForm() {
  return (
    <div className="w-1/2 min-w-50 py-6 flex flex-col gap-2 bg-muted rounded-lg items-center max-w-100">
      <h3 className="font-semiobld text-2xl text-black text-center">로그인</h3>
      <form action="" className="w-2/3 flex flex-col gap-2">
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="username" className="text-sm">
            아이디
          </label>
          <input
            type="text"
            className="h-8 p-2 w-full rounded"
            id="username"
            name="username"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="password" className="text-sm">
            비밀번호
          </label>
          <input
            type="password"
            className="h-8 p-2 w-full rounded"
            id="password"
            name="password"
          />
        </div>
      </form>
    </div>
  );
}
