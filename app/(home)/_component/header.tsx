'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import LoadingIndicator from '@/components/loading-indicator';
import { Profile } from '@/types';
import { signOut } from 'next-auth/react';

const Header = ({ profile }: { profile: Profile }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<'sign-in' | 'sign-up' | null>(null);

    const handleNavigate = (path: string, type: 'sign-in' | 'sign-up') => {
        setLoading(type);
        router.push(path);
    };

    return (
        <header>
            <div className="flex flex-row-reverse items-center gap-2">
                {!profile.username ? (
                    <div className="flex gap-2">
                        <Button
                            className="group relative flex items-center gap-2 overflow-hidden rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-slate-100 hover:text-pink-600"
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => handleNavigate('/sign-in', 'sign-in')}
                            disabled={loading !== null}
                        >
                            {loading === 'sign-in' ? (
                                <>
                                    <LoadingIndicator />
                                    Sign In
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <Button
                            className="group relative flex items-center gap-2 overflow-hidden rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-slate-100 hover:text-pink-600"
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => handleNavigate('/sign-up', 'sign-up')}
                            disabled={loading !== null}
                        >
                            {loading === 'sign-up' ? (
                                <>
                                    <LoadingIndicator />
                                    Sign In
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex cursor-pointer items-center justify-center gap-2">
                                <Avatar>
                                    <AvatarImage src={profile.avatar} alt={profile.username} />
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Button variant="outline" onClick={() => signOut()} className="w-full">
                                Sign Out
                            </Button>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <ModeToggle />
            </div>
        </header>
    );
};

export default Header;
