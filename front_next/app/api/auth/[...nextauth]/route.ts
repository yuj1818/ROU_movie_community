import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: '아이디', type: 'text' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/accounts/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          },
        );

        if (!res.ok) return null;

        const data = await res.json();

        return {
          id: data.user,
          backendToken: data.key,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.backendToken = user.backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.backendToken = token.backendToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
