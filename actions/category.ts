'use server';

import { prisma } from '@/lib/prisma';
import { errorResponse, executeWithCatch, successResponse } from '@/lib/response-helpers';
import { CategoryModalSchema, CategoryModalSchemaType } from '@/schema/product';

// ─── Create Category by ID ───────────────────────────────────────
export const createCategory = async (value: CategoryModalSchemaType) => {
    return executeWithCatch(async () => {
        const parseResult = CategoryModalSchema.safeParse(value);
        if (!parseResult.success) {
            return errorResponse(parseResult.error.flatten(), 'Invalid data');
        }
        const data = parseResult.data;
        const { name, genders } = data;

        const existing = await prisma.category.findFirst({
            where: { name: data.name, deletedAt: null },
            include: {
                genders: true,
            },
        });

        const id = existing?.genders;

        const newCategory = await prisma.$transaction(async (tx) => {
            const category = await tx.category.create({
                data: { name },
            });

            if (genders.length > 0) {
                await tx.categoryGender.createMany({
                    data: genders.map((gender) => ({
                        categoryId: category.id,
                        genderId: gender.id,
                    })),
                });
            }
        });

        return successResponse(newCategory, 'Category created successfully.');
    });
};

// ─── Update Category by ID ───────────────────────────────────────
export const updateCategory = async (categoryId: string, value: CategoryModalSchemaType) => {
    return executeWithCatch(async () => {
        const parseResult = CategoryModalSchema.safeParse(value);
        if (!parseResult.success) {
            return errorResponse(parseResult.error.flatten(), 'Invalid data');
        }
        const data = parseResult.data;
        const category = await prisma.category.findUnique({
            where: { id: categoryId, deletedAt: null },
        });
        if (!category) {
            return errorResponse('Category does not exist.', 'Not Found');
        }
        const duplicate = await prisma.category.findFirst({
            where: {
                name: data.name,
                deletedAt: null,
                NOT: { id: categoryId },
            },
        });
        if (duplicate) {
            return errorResponse('Category name is already in use.', 'Conflict');
        }
        const updated = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: data.name,
            },
        });
        return successResponse(updated, 'Category updated successfully.');
    });
};

// ─── Delete Categories by ID ───────────────────────────────────────
export const deleteCategory = async (categoryId: string) => {
    return executeWithCatch(async () => {
        if (!categoryId) return errorResponse('Invalid ID.', 'Bad Request');
        const category = await prisma.category.findUnique({
            where: { id: categoryId, deletedAt: null },
        });
        if (!category) {
            return errorResponse('Category does not exist.', 'Not Found');
        }
        const deleted = await prisma.category.update({
            where: { id: categoryId },
            data: { deletedAt: new Date() },
        });
        return successResponse(deleted, 'Category deleted successfully.');
    });
};

// ─── Get Categories by Gender ID ───────────────────────────────────────
export const getCategoriesByGenderId = async (genderId: string) => {
    return executeWithCatch(async () => {
        if (!genderId || typeof genderId !== 'string') {
            return errorResponse('Invalid gender ID.', 'Bad Request');
        }

        const categoryGenders = await prisma.categoryGender.findMany({
            where: {
                genderId,
                category: { deletedAt: null },
            },
            include: {
                category: true,
            },
        });

        const categories = categoryGenders.map(({ category }) => ({
            id: category.id,
            name: category.name,
        }));

        return successResponse(categories, 'Categories fetched successfully.');
    });
};

// ─── Get Category by ID ───────────────────────────────────────
export const getCategoryById = async (id: string) => {
    return executeWithCatch(async () => {
        const category = await prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            return errorResponse('Category does not exist.', 'Not Found');
        }
        return successResponse(category, 'Category fetched successfully.');
    });
};
