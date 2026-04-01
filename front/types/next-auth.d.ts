import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    backendToken?: string;
    user: {
      id: string;
      is_staff?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    backendToken?: string;
    is_staff?: boolean;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    backendToken?: string;
    is_staff?: boolean;
    username?: string;
  }
}
