import { z } from 'zod';

export const ImagesSchema = z
    .array(
        z.object({
            file: z.union([z.instanceof(File), z.string()]),
            key: z.string(),
            progress: z.union([z.literal('PENDING'), z.literal('COMPLETE'), z.literal('ERROR'), z.number()]),
        }),
    )
    .min(1, 'At least one image must be selected')
    .refine((arr) => arr.every((item) => item.progress !== 'ERROR' || item === undefined), {
        message: 'Please check image uploader ',
    });

export const ThumbnailSchema = z.preprocess(
    (input) => {
        if (input instanceof File || typeof input === 'string') return input;
        return undefined;
    },
    z.union([
        z.instanceof(File, { message: 'Thumbnail is required' }),
        z.string().min(1, { message: 'Thumbnail is required' }),
    ]),
);

export const CreateProductSchema = z
    .object({
        name: z.string().min(6, 'min 6').max(50, 'max 50'),
        gender: z.object({
            id: z.string().min(1, 'Gender ID is required'),
            name: z
                .string()
                .min(1, 'Gender name is required')
                .transform((val) => val.trim().replace(/\s+/g, ' ')),
        }),

        category: z.object({
            id: z.string().min(1, 'Category ID is required'),
            name: z
                .string()
                .min(1, 'Category name is required')
                .transform((val) => val.trim().replace(/\s+/g, ' ')),
        }),

        detailCategory: z.object({
            id: z.string().min(1, 'DetailCategory ID is required'),
            name: z
                .string()
                .min(1, 'DetailCategory name is required')
                .transform((val) => val.trim().replace(/\s+/g, ' ')),
        }),
    })
    .superRefine((data, ctx) => {
        if (!data.gender.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['gender'],
                message: 'Gender is required',
            });
        }
        if (!data.category.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['category'],
                message: 'Category is required.',
            });
        }
        if (!data.detailCategory.id) {
            ctx.addIssue({
                code: 'custom',
                path: ['detailCategory'],
                message: 'DetailCategory is required.',
            });
        }
    });

export const GenderModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Gender name is required')
        .max(255, 'Gender name is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
});

export const CategoryModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(255, 'Category name is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
    genders: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
        }),
    ),
});

export const DetailCategoryModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Detail category name is required')
        .max(255, 'Detail category name is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
    categoryId: z.string().min(1, 'Category ID in DetailCategory is required'),
});

export const PromotionModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Promotion is required')
        .max(255, 'Promotion is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
    description: z.string().min(1, 'Description promotion  is required').max(255, 'Description promotion is too long'),
});

export const TrademarkModalSchema = z.object({
    name: z
        .string()
        .min(1, 'Trademark is required')
        .max(255, 'Trademark is too long')
        .transform((val) => val.trim().replace(/\s+/g, ' ')),
});

export type GenderModalSchemaType = z.infer<typeof GenderModalSchema>;
export type CategoryModalSchemaType = z.infer<typeof CategoryModalSchema>;
export type CreateProductSchemaType = z.infer<typeof CreateProductSchema>;
export type PromotionModalSchemaType = z.infer<typeof PromotionModalSchema>;
export type TrademarkModalSchemaType = z.infer<typeof TrademarkModalSchema>;
export type DetailCategoryModalSchemaType = z.infer<typeof DetailCategoryModalSchema>;
