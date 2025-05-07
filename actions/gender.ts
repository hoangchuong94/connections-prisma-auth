'use server';

import { prisma } from '@/lib/prisma';
import { errorResponse, executeWithCatch, successResponse } from '@/lib/response-helpers';
import { GenderModalSchema } from '@/schema/product';
import { revalidatePath } from 'next/cache';

// ─── Create Gender ─────────────────────────────────────────────────────
export const createGender = async (value: unknown) => {
    return executeWithCatch(async () => {
        const parseResult = GenderModalSchema.safeParse(value);
        if (!parseResult.success) {
            return errorResponse(parseResult.error.flatten(), 'Invalid data');
        }

        const data = parseResult.data;

        const existing = await prisma.gender.findFirst({
            where: { name: data.name, deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });

        if (existing) {
            return errorResponse('Gender name is already in use.', 'Duplicate entry');
        }

        const gender = await prisma.gender.create({ data });
        revalidatePath('/');
        return successResponse(gender, 'Gender created successfully.');
    });
};

// ─── Update Gender ─────────────────────────────────────────────────────
export const updateGender = async (genderId: string, value: unknown) => {
    return executeWithCatch(async () => {
        const parseResult = GenderModalSchema.safeParse(value);
        if (!parseResult.success) {
            return errorResponse(parseResult.error.flatten(), 'Invalid data');
        }

        const data = parseResult.data;

        const gender = await prisma.gender.findUnique({
            where: { id: genderId, deletedAt: null },
        });

        if (!gender) {
            return errorResponse('Gender does not exist.', 'Gender not found');
        }

        const duplicate = await prisma.gender.findFirst({
            where: {
                name: data.name,
                deletedAt: null,
                NOT: { id: genderId },
            },
        });

        if (duplicate) {
            return errorResponse('Gender name is already in use.', 'Duplicate entry');
        }

        const updated = await prisma.gender.update({
            where: { id: genderId },
            data,
        });

        return successResponse(updated, 'Gender updated successfully.');
    });
};

// ─── Delete Gender (Soft Delete) ───────────────────────────────────────
export const deleteGender = async (genderId: string) => {
    return executeWithCatch(async () => {
        if (!genderId) return errorResponse('Invalid ID.', 'Invalid ID');

        const gender = await prisma.gender.findUnique({
            where: { id: genderId, deletedAt: null },
        });

        if (!gender) {
            return errorResponse('Gender does not exist.', 'Gender not found');
        }

        const deleted = await prisma.gender.update({
            where: { id: genderId },
            data: { deletedAt: new Date() },
        });

        return successResponse(deleted, 'Gender deleted successfully.');
    });
};

// ─── Get Gender by ID ──────────────────────────────────────────────────
export const getGenderById = async (id: string) => {
    return executeWithCatch(async () => {
        const gender = await prisma.gender.findUnique({ where: { id, deletedAt: null } });

        if (!gender) {
            return errorResponse('Gender does not exist.', 'Gender not found');
        }

        return successResponse(gender, 'Gender fetched successfully.');
    });
};

// ─── Get All Genders ───────────────────────────────────────────────────
export const getAllGenders = async () => {
    return executeWithCatch(async () => {
        const genders = await prisma.gender.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });
        return successResponse(genders, 'All genders fetched successfully.');
    });
};

// ─── Get All Genders ───────────────────────────────────────────────────
export const getAllGendersJoinCategory = async () => {
    return executeWithCatch(async () => {
        const genders = await prisma.gender.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        return successResponse(genders, 'All genders fetched successfully.');
    });
};
