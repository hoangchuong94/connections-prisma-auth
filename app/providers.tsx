'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/app/theme-provider';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'sonner';
import { Session } from 'next-auth';

export default function Providers({ children, session }: { children: React.ReactNode; session: Session | null }) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <EdgeStoreProvider>
                    <ReduxProvider store={store}>
                        {children}
                        <Toaster position="top-right" richColors closeButton />
                    </ReduxProvider>
                </EdgeStoreProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}
