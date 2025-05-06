import NextAuth from 'next-auth';
import { authConfig } from '@/auth/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
