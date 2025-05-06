import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

interface ModalProps {
    open: boolean;
    description?: string;
    openChange: (value: boolean) => void;
    title: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({
    title,
    className,
    description,
    header,
    footer,
    children,
    open,
    openChange,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent aria-describedby={undefined} className={className}>
                <DialogHeader>
                    <DialogHeader className="capitalize">
                        {header || (
                            <DialogTitle className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-center font-serif text-2xl font-thin text-transparent">
                                {title}
                            </DialogTitle>
                        )}
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                </DialogHeader>
                <div>{children}</div>
                <DialogFooter className="mt-4">{footer}</DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
