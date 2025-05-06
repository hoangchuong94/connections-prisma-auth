'use server';

import { getCategoriesByGenderId } from '@/actions/category';

const OverviewPage = async () => {
    const ct = await getCategoriesByGenderId('cmaccdd1g0000k0169394f1db');
    return (
        <div>
            <h2>{JSON.stringify(ct.data, null, 2)}</h2>
        </div>
    );
};

export default OverviewPage;
