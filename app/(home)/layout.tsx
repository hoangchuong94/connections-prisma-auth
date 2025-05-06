import type { Metadata } from 'next';
import Header from './_component/header';
import { auth } from '@/auth/auth';
import { Profile } from '@/types';

export const metadata: Metadata = {
    title: 'Home Page',
    description: 'Home page by create next app',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const profile: Profile = {
        username: session?.user.name || '',
        email: session?.user.email || '',
        avatar: 'https://github.com/shadcn.png',
    };
    return (
        <div className="grid grid-rows-[auto_1fr_auto] p-2">
            <Header profile={profile} />
            <main>{children}</main>
            <footer className="p-4">footer</footer>
        </div>
    );
}
