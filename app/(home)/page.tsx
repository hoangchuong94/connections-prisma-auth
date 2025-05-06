import React from 'react';
import { auth } from '@/auth/auth';

const HomePage = async () => {
    const session = await auth();
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
            <div className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
                <h1>{JSON.stringify(session?.user, null, 2)}</h1>
            </div>
        </div>
    );
};

export default HomePage;
