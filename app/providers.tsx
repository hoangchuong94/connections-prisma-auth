import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './theme-provider';

import React from 'react';

const Providers = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
};

export default Providers;
