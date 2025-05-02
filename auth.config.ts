import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { comparePassword } from './actions/hash-password';
import { prisma } from '@/lib/prisma';
import { DEFAULT_ADMIN_SIGN_IN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';
import { NextResponse } from 'next/server';
import { UserRole } from './lib/generated/prisma';

export const authConfig = {
    providers: [
        GitHub,
        Google,
        Credentials({
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: String(credentials.email) },
                });

                if (!user || !(await comparePassword(String(credentials.password), user.password!))) {
                    return null;
                }

                return user;
            },
        }),
    ],

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.role = user.role;
            }
            return token;
        },

        session: async ({ session, token }) => {
            if (token.sub && token.role) {
                session.user.id = token.sub;
                session.user.role = token.role as UserRole;
            }
            return session;
        },

        signIn: async ({ user, account }) => {
            if (account?.provider !== 'credentials') return true;

            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
            });

            return !!existingUser?.emailVerified;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
            const isAuthRoute = authRoutes.includes(nextUrl.pathname);
            const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

            if (isApiAuthRoute) {
                if (nextUrl.href.includes('error')) {
                    return NextResponse.redirect(new URL(`/sign-in${nextUrl.search}`, nextUrl));
                }
                return true;
            }

            if (isAuthRoute) {
                if (isLoggedIn && auth.user?.role === 'ADMIN') {
                    return NextResponse.redirect(new URL(DEFAULT_ADMIN_SIGN_IN_REDIRECT, nextUrl));
                }
                if (isLoggedIn && auth.user?.role === 'USER') {
                    return NextResponse.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            if (!isPublicRoute) {
                if (!isLoggedIn) {
                    return NextResponse.redirect(new URL('/sign-in', nextUrl));
                }
                if (isLoggedIn && auth.user?.role !== 'ADMIN') {
                    const encodedUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
                    return NextResponse.redirect(new URL(`/feedback?callbackUrl=${encodedUrl}`, nextUrl));
                }
            }

            return true;
        },
    },

    events: {
        linkAccount: async ({ user }) => {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
} satisfies NextAuthConfig;
