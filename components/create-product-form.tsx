'use client';

import useSWR from 'swr';
import { useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Check, SquarePen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { getAllGenders } from '@/actions/gender';
import { fetcher } from '@/lib/response-helpers';
import { PopoverSelect } from '@/components/popover-select';
import { getCategoriesByGenderId } from '@/actions/category';
import { getDetailCategoriesByCategoryId } from '@/actions/detail-category';
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

export default function CreateProductForm() {
    const [isPending, startTransition] = useTransition();

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

    const {
        data: genders = [],
        error: genderError,
        isLoading: genderLoading,
    } = useSWR('genders', () => fetcher(getAllGenders));

    const {
        data: categories = [],
        error: categoryError,
        isLoading: categoryLoading,
    } = useSWR(genderId, () => fetcher(() => getCategoriesByGenderId(genderId)));

    const {
        data: detailCategories = [],
        error: detailCategoryError,
        isLoading: detailCategoryLoading,
    } = useSWR(categoryId, () => fetcher(() => getDetailCategoriesByCategoryId(categoryId)));

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
                        disabled={isPending || genderLoading || categoryLoading || detailCategoryLoading}
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
                                    items={
                                        genders?.map((item) => {
                                            return {
                                                id: item.id,
                                                name: item.name,
                                            };
                                        }) || []
                                    }
                                    getItemName={(item) => item.name}
                                    getKey={(item) => item.id}
                                    onChange={field.onChange}
                                    disabled={genderLoading}
                                />
                            </FormControl>
                            <FormDescription>Select the product gender.</FormDescription>
                            {genderError && <FormMessage>{genderError}</FormMessage>}
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
                                    items={
                                        categories?.map((item) => {
                                            return {
                                                id: item.id,
                                                name: item.name,
                                            };
                                        }) || []
                                    }
                                    getItemName={(item) => item.name}
                                    getKey={(item) => item.id}
                                    onChange={field.onChange}
                                    disabled={!genderId || categoryLoading}
                                />
                            </FormControl>
                            <FormDescription>Select the product category.</FormDescription>
                            {categoryError && <FormMessage>{categoryError}</FormMessage>}
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
                                    items={
                                        detailCategories?.map((item) => {
                                            return {
                                                id: item.id,
                                                name: item.name,
                                            };
                                        }) || []
                                    }
                                    getItemName={(item) => item.name}
                                    getKey={(item) => item.id}
                                    onChange={field.onChange}
                                    disabled={!categoryId || detailCategoryLoading}
                                />
                            </FormControl>
                            <FormDescription>Select the product detail category.</FormDescription>
                            {detailCategoryError && <FormMessage>{detailCategoryError}</FormMessage>}
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
