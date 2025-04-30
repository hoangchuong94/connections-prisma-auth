import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex justify-center items-center px-4 xl:px-0 bg-slate-200 dark:bg-gray-600">
      {children}
    </main>
  );
}
