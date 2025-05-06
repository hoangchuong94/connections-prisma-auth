'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
    CirclePercent,
    CreditCard,
    LayoutDashboard,
    Store,
    ChartNoAxesCombined,
    NotebookText,
    HandCoins,
    ListRestart,
    ChevronsUpDown,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import logo from '@/public/static/logo.png';
import { Profile } from '@/types';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';

interface DashboardSidebarProps {
    profile: Profile;
}

const menuItems = [
    { path: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
    { path: 'analytics', label: 'Analytics', icon: <ChartNoAxesCombined /> },
    { path: 'products', label: 'Product', icon: <Store /> },
    { path: 'sales', label: 'Sales', icon: <CirclePercent /> },
];

const transactionItems = [
    { path: 'payment', label: 'Payment', icon: <CreditCard /> },
    { path: 'returns', label: 'Returns', icon: <HandCoins /> },
    { path: 'invoice', label: 'Invoice', icon: <NotebookText /> },
    { path: 'refunds', label: 'Refunds', icon: <ListRestart /> },
];

const SidebarNavItem = ({ path, label, icon }: { path: string; label: string; icon: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === `/${path}` || pathname.startsWith(`/${path}/`);

    return (
        <SidebarMenuItem className="flex items-center justify-center">
            <SidebarMenuButton
                asChild
                className={cn(
                    'group relative flex items-center gap-2 overflow-hidden rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out',
                    isActive
                        ? 'scale-[1.03] bg-gradient-to-r from-green-600 to-blue-400 text-white shadow-md hover:text-white'
                        : 'text-gray-700 hover:scale-[1.02] hover:bg-slate-100 hover:text-pink-600',
                )}
            >
                <Link href={`/${path}`}>
                    {icon}
                    <span>{label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};

export const DashboardSidebar = ({ profile }: DashboardSidebarProps) => {
    const { open, setOpen, setOpenMobile, openMobile, isMobile } = useSidebar();

    const handleToggleMenuBar = () => {
        setOpen(!open);
        if (isMobile) {
            setOpenMobile(!openMobile);
        }
    };

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem onClick={handleToggleMenuBar}>
                        <Image
                            src={logo}
                            alt="logo"
                            width={280}
                            height={280}
                            quality={100}
                            priority
                            className="cursor-pointer rounded-md"
                        />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarNavItem key={item.path} {...item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Transaction</SidebarGroupLabel>
                    <SidebarMenu>
                        {transactionItems.map((item) => (
                            <SidebarNavItem key={item.path} {...item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center justify-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex w-full cursor-pointer items-center justify-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={profile.avatar} alt={profile.username} />
                                        </Avatar>
                                        {open && (
                                            <SidebarMenuButton className="flex items-center justify-between">
                                                <span>{profile.username}</span>
                                                <ChevronsUpDown />
                                            </SidebarMenuButton>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Button variant="outline" onClick={() => signOut()} className="w-full">
                                        Sign Out
                                    </Button>
                                    <DropdownMenuSeparator />
                                    <ModeToggle />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            </SidebarFooter>
        </Sidebar>
    );
};
