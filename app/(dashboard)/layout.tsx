import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Profile } from '@/types';
import { Card } from '@/components/ui/card';

import { auth } from '@/auth/auth';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Admin Dashboard by create next app',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
    const session = await auth();

    const profile: Profile = {
        username: session?.user.name || '',
        email: session?.user.email || '',
        avatar: 'https://github.com/shadcn.png',
    };

    return (
        <SidebarProvider defaultOpen={defaultOpen} className="bg-slate-200">
            <DashboardSidebar profile={profile} />
            <SidebarInset className="max-h-screen bg-slate-200">
                <Card className="scrollbar-thin custom-scrollbar bg-card text-card-foreground scrollbar-thumb-gray-400 scrollbar-track-gray-200 h-full max-h-screen overflow-hidden overflow-x-hidden overflow-y-auto scroll-smooth rounded-2xl p-2 shadow-md max-md:m-2 md:my-2 md:mr-2">
                    {children}
                </Card>
            </SidebarInset>
        </SidebarProvider>
    );
}
