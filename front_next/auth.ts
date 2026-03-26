import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

export const authOptions: NextAuthOptions = {
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/login`,
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
          id: String(data.user.id),
          username: data.user.username,
          is_staff: data.user.is_staff,
          backendToken: data.key,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'backendToken' in user) {
        token.userId = user.id;
        token.backendToken = user.backendToken;
        token.is_staff = user.is_staff;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.is_staff = token.is_staff;
        session.user.username = token.username;
      }
      session.backendToken = token.backendToken as string;
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/google/login/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_token: account.id_token,
            }),
          },
        );

        if (!res.ok) return false;

        const data = await res.json();

        if (res.status === 200) {
          // 기존 유저 정보 저장
          user.id = String(data.user.id);
          user.is_staff = data.user.is_staff;
          user.username = data.user.username;
          user.backendToken = data.key;
          return true;
        }

        if (res.status === 202) {
          // 신규 유저 → 추가 정보 페이지로 redirect
          return `/register?isSocial=true&email=${data.email}&uid=${data.uid}`;
        }

        return false;
      }

      if (account?.provider === 'kakao') {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/kakao/login/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: account.access_token,
            }),
          },
        );

        if (!res.ok) return false;

        const data = await res.json();

        user.id = String(data.user.id);
        user.is_staff = data.user.is_staff;
        user.username = data.user.username;
        user.backendToken = data.key;
        return true;
      }

      return true;
    },
  },
};
