import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication',
    description: 'Authentication by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="grid grid-rows-[auto_1fr_auto]">
            <div className='dark:bg-gray-600" flex min-h-screen items-center justify-center bg-slate-200 px-4 xl:px-0'>
                {children}
            </div>
        </main>
    );
}
