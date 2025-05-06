'use server';

import { prisma } from '@/lib/prisma';
import { errorResponse, executeWithCatch, successResponse } from '@/lib/response-helpers';
import { CategoryModalSchema } from '@/schema/product';

// ─── Get Detail Categories by Category ID ──────────────────────────────

export const getDetailCategoriesByCategoryId = async (id: string) => {
    return executeWithCatch(async () => {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                detailCategories: {
                    include: { detailCategory: true },
                },
            },
        });

        const details =
            category?.detailCategories.map((item) => ({
                id: item.detailCategory.id,
                name: item.detailCategory.name,
            })) || [];
        return successResponse(details);
    });
};
