import type { Metadata } from "next";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoadingIndicator from "@/components/loading-indicator";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Home page by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="flex flex-row-reverse p-4">
        <div className="flex justify-center items-center gap-2">
          <ModeToggle />
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            size="lg"
          >
            <Link href={"/sign-in"}>
              Sign In <LoadingIndicator />
            </Link>
          </Button>
          <Button
            className="cursor-pointer"
            type="button"
            variant="ghost"
            size="lg"
          >
            <Link href={"/sign-up"}>
              Sign Up <LoadingIndicator />
            </Link>
          </Button>
        </div>
      </header>
      {children}
      <footer className="p-4">footer</footer>
    </main>
  );
}
