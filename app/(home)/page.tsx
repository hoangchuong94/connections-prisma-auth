import React from 'react';
import { prisma } from '@/lib/prisma';

const HomePage = async () => {
    const categories = await prisma.category.findMany();
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
            <div className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
                <h1>home page</h1>
                <h1>{JSON.stringify(categories, null, 2)}</h1>
            </div>
        </div>
    );
};

export default HomePage;
