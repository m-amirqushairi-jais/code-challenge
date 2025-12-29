import { z } from 'zod';

export const createResourceSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must be less than 255 characters')
        .trim(),

    description: z
        .string()
        .max(1000, 'Description must be less than 1000 characters')
        .trim()
        .optional()
        .or(z.literal(''))
        .default(''),

    status: z
        .enum(['active', 'inactive'])
        .default('active')
        .optional(),
});

export const updateResourceSchema = z.object({
    name: z
        .string()
        .min(1, 'Name cannot be empty')
        .max(255, 'Name must be less than 255 characters')
        .trim()
        .optional(),

    description: z
        .string()
        .max(1000, 'Description must be less than 1000 characters')
        .trim()
        .optional()
        .or(z.literal('')),

    status: z
        .enum(['active', 'inactive'])
        .optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
);

export const resourceFiltersSchema = z.object({
    status: z
        .enum(['active', 'inactive'])
        .optional(),

    search: z
        .string()
        .trim()
        .optional(),

    limit: z
        .string()
        .transform(Number)
        .pipe(z.number().min(1).max(100))
        .default('20')
        .optional(),

    offset: z
        .string()
        .transform(Number)
        .pipe(z.number().min(0))
        .default('0')
        .optional(),
});

export const resourceIdSchema = z.object({
    id: z
        .string()
        .transform(Number)
        .pipe(z.number().positive('ID must be a positive number')),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type ResourceFilters = z.infer<typeof resourceFiltersSchema>;
export type ResourceIdParam = z.infer<typeof resourceIdSchema>;