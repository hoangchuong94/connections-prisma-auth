import CreateProductForm from '@/components/create-product-form';
import { getAllGendersJoinCategory } from '@/actions/gender';

export const dynamic = 'force-dynamic';

const ProductPage = async () => {
    const res = await getAllGendersJoinCategory();

    if (!res.success || !res.data) {
        return null;
    }

    const genders = res.data.map((item) => {
        const omit = item.categories.map((item) => {
            return {
                id: item.category.id,
                name: item.category.name,
            };
        });
        return {
            id: item.id,
            name: item.name,
            categories: omit,
        };
    });

    return <CreateProductForm dataGenders={genders} />;
};

export default ProductPage;
