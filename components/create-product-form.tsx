'use client';

import useSWR from 'swr';
import { useEffect, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Check, SquarePen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { PopoverSelect } from '@/components/popover-select';
import { CreateProductSchemaType, CreateProductSchema } from '@/schema/product';
import {
    CREATE_CATEGORY,
    CREATE_DETAIL_CATEGORY,
    CREATE_GENDER,
    DELETE_CATEGORY,
    DELETE_DETAIL_CATEGORY,
    DELETE_GENDER,
    UPDATE_CATEGORY,
    UPDATE_DETAIL_CATEGORY,
    UPDATE_GENDER,
} from '@/constants/routes';

interface CreateProductFormProps {
    dataGenders: {
        id: string;
        name: string;
        categories: {
            id: string;
            name: string;
        }[];
    }[];
}

export default function CreateProductForm({ dataGenders }: CreateProductFormProps) {
    const [isPending, startTransition] = useTransition();
    const [genders, setGenders] = useState(dataGenders);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const form = useForm<CreateProductSchemaType>({
        resolver: zodResolver(CreateProductSchema),
        defaultValues: {
            name: '',
            gender: { id: '', name: '' },
            category: { id: '', name: '' },
            detailCategory: { id: '', name: '' },
        },
    });

    const { id: genderId } = useWatch({ control: form.control, name: 'gender' });
    const { id: categoryId } = useWatch({ control: form.control, name: 'category' });

    useEffect(() => {
        if (genderId) {
            const filterCategoryByIdGender = genders.find((item) => item.id === genderId)?.categories;
            if (filterCategoryByIdGender) {
                setCategories(filterCategoryByIdGender);
            }
        }
    }, [genderId]);

    const onSubmit = (values: CreateProductSchemaType) => {
        startTransition(() => {
            console.log(values);
            // Xử lý submit ở đây (ví dụ gửi API)
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="flex items-center text-xl font-semibold">
                        <SquarePen className="mr-2" />
                        Create Product
                    </h1>
                    <Button
                        type="submit"
                        size="lg"
                        className="rounded-4xl bg-green-400 text-white hover:bg-blue-500"
                        disabled={isPending}
                    >
                        <Check className="mr-2" />
                        Add Product
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name:</FormLabel>
                            <FormControl>
                                <Input placeholder="Please enter name" {...field} />
                            </FormControl>
                            <FormDescription>Enter the product name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Gender Field */}
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender:</FormLabel>
                            <FormControl>
                                <PopoverSelect
                                    value={field.value}
                                    defaultLabel="Select a gender"
                                    createHref={CREATE_GENDER}
                                    updateHref={UPDATE_GENDER}
                                    deleteHref={DELETE_GENDER}
                                    items={genders}
                                    getItemName={(item) => item.name}
                                    getKey={(item) => item.id}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>Select the product gender.</FormDescription>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category:</FormLabel>
                            <FormControl>
                                <PopoverSelect
                                    value={field.value}
                                    defaultLabel="Select a category"
                                    createHref={CREATE_CATEGORY}
                                    updateHref={UPDATE_CATEGORY}
                                    deleteHref={DELETE_CATEGORY}
                                    items={categories}
                                    getItemName={(item) => item.name}
                                    getKey={(item) => item.id}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>Select the product category.</FormDescription>
                        </FormItem>
                    )}
                />

                {/* Detail Category Field */}
                <FormField
                    control={form.control}
                    name="detailCategory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Detail Category:</FormLabel>
                            <FormControl>
                                <PopoverSelect
                                    value={field.value}
                                    defaultLabel="Select a detail category"
                                    createHref={CREATE_DETAIL_CATEGORY}
                                    updateHref={UPDATE_DETAIL_CATEGORY}
                                    deleteHref={DELETE_DETAIL_CATEGORY}
                                    items={[]}
                                    getItemName={(item) => item.name}
                                    getKey={(item) => item.id}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>Select the product detail category.</FormDescription>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
