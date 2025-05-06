'use client';

import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Check, ChevronsUpDown, Plus, Trash, Pencil, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface PopoverSelectProps<T> {
    items: T[];
    defaultValue?: T | string;
    value?: T | string;
    getItemName: (item: T) => string;
    getKey: (item: T) => string;
    onChange: (value: T | string | undefined) => void;
    disabled?: boolean;
    createHref?: string;
    updateHref?: string;
    deleteHref?: string;
    defaultLabel?: string;
    className?: string;
}

export const PopoverSelect = <T,>({
    items = [],
    defaultValue,
    value,
    getItemName,
    getKey,
    onChange,
    createHref,
    updateHref,
    deleteHref,
    disabled = false,
    defaultLabel = 'Select an item',
    className,
}: PopoverSelectProps<T>) => {
    const [open, setOpen] = React.useState(false);
    const [isRedirecting, setIsRedirecting] = React.useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchString = searchParams?.toString();

    React.useEffect(() => {
        if (isRedirecting) {
            setIsRedirecting(false);
        }
    }, [isRedirecting, pathname, searchString]);

    const selected = React.useMemo(() => {
        const selectedItem = value ?? defaultValue;
        if (!selectedItem) return undefined;
        const selectedKey = typeof selectedItem === 'string' ? selectedItem : getKey(selectedItem);
        return items.find((item) => getKey(item) === selectedKey);
    }, [value, defaultValue, items, getKey]);

    const selectedName = selected ? getItemName(selected) : defaultLabel;

    const handleSelect = React.useCallback(
        (key: string) => {
            const selectedItem = items.find((item) => getKey(item).toString() === key);
            if (selectedItem) {
                onChange(typeof value === 'string' ? key : selectedItem);
            }
            setOpen(false);
        },
        [items, value, getKey, onChange],
    );

    const handleRedirect = (href: string) => {
        setIsRedirecting(true);
        router.push(href);
    };

    return (
        <div className="flex flex-row gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn('flex-1 justify-between', { 'bg-slate-200': disabled })}
                        disabled={disabled || isRedirecting}
                    >
                        {!disabled && <p className="text-foreground text-xs capitalize">{selectedName}</p>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className={cn('min-w-72 p-0 max-sm:ml-4 md:w-96', { 'md:ml-11': createHref }, className)}
                >
                    <Command>
                        <CommandInput placeholder="Search..." disabled={disabled || isRedirecting} />
                        <CommandList>
                            <CommandEmpty>No data</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => {
                                    const itemName = getItemName(item);
                                    const id = getKey(item).toString();
                                    const isSelected = selected && getKey(selected) === id;

                                    return (
                                        <CommandItem
                                            key={id}
                                            className="flex flex-1 cursor-pointer capitalize"
                                            value={itemName}
                                            onSelect={() => handleSelect(id)}
                                            disabled={disabled || isRedirecting}
                                        >
                                            <div className="flex flex-1">
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        isSelected ? 'opacity-100' : 'opacity-0',
                                                    )}
                                                />
                                                {itemName}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {updateHref && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        disabled={isRedirecting}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRedirect(`${updateHref}&id=${id}`);
                                                        }}
                                                        className="group transition-colors duration-300 ease-in-out hover:bg-blue-500"
                                                    >
                                                        <Pencil className="h-4 w-4 text-blue-500 transition-colors duration-300 ease-in-out group-hover:text-white" />
                                                    </Button>
                                                )}
                                                {deleteHref && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        disabled={isRedirecting}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRedirect(`${deleteHref}&id=${id}`);
                                                        }}
                                                        className="group transition-colors duration-300 ease-in-out hover:bg-red-500"
                                                    >
                                                        <Trash className="h-4 w-4 text-red-500 transition-colors duration-300 ease-in-out group-hover:text-white" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {!disabled && createHref && (
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => handleRedirect(createHref)}
                    disabled={isRedirecting}
                >
                    {isRedirecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
            )}
        </div>
    );
};
