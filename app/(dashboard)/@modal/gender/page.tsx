'use client';
import { mutate } from 'swr';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';

import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import Modal from '@/components/modal';
import { FormError } from '@/components/form-error';
import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';
import { GenderModalSchema, GenderModalSchemaType } from '@/schema/product';
import { LoadingSkeletonUpdateGenderForm } from '@/components/loading-skeleton';
import { createGender, updateGender, deleteGender, getGenderById } from '@/actions/gender';

export default function GenderModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get('action');
    const genderId = searchParams.get('id');

    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const form = useForm<GenderModalSchemaType>({
        resolver: zodResolver(GenderModalSchema),
        defaultValues: { name: '' },
    });

    const formValues = form.watch();
    const isChanged = useMemo(() => {
        return !isEqual(formValues, form.formState.defaultValues);
    }, [formValues, form.formState.defaultValues]);

    const closeModal = useCallback(
        (isOpen: boolean) => {
            setOpen(isOpen);
            if (!isOpen) {
                setErrorMessage('');
                setSuccessMessage('');
                router.back();
            }
        },
        [router],
    );

    const onSubmit = async (values: GenderModalSchemaType) => {
        if (action === 'update' && !isChanged) {
            setErrorMessage('No changes detected.');
            return;
        }
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        let result;
        switch (action) {
            case 'create':
                result = await createGender(values);
                break;
            case 'update':
                if (genderId) result = await updateGender(genderId, values);
                break;
            default:
                throw new Error('Invalid action');
        }
        if (result && result.success && result.data) {
            setSuccessMessage(result.message);
            router.refresh();
        } else {
            setErrorMessage(result?.error || 'An unexpected error occurred.');
        }
        setLoading(false);
    };

    const handleDeleteCategory = async () => {
        if (!genderId) return;
        setLoading(true);
        setErrorMessage('');
        const { error, success, message } = await deleteGender(genderId);

        if (success) {
            closeModal(false);
            toast.success(message);
        } else {
            setErrorMessage(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (action === 'update' && genderId) {
            const fetchData = async () => {
                setFetching(true);
                const { data, success, error } = await getGenderById(genderId);
                if (success && data) form.reset(data);
                else setErrorMessage(error);
                setFetching(false);
            };
            fetchData();
        }
    }, [action, genderId, form]);

    return (
        <Modal title={`${action} Gender`} open={open} openChange={closeModal}>
            {action !== 'delete' ? (
                fetching ? (
                    <LoadingSkeletonUpdateGenderForm />
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <InputField
                                name="name"
                                label="Gender Name"
                                placeholder={action === 'create' ? 'Enter gender name' : ''}
                                disabled={loading}
                            />
                            <FormSuccess message={successMessage} />
                            <FormError message={errorMessage} />
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    disabled={loading}
                                    onClick={() => router.back()}
                                >
                                    Close
                                </Button>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading || !isChanged}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 dark:text-white"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Save />}
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            ) : (
                <div className="mt-4 flex flex-col gap-4">
                    <p className="font-semibold text-red-600">
                        Warning: This will permanently delete this gender and affect related products!
                    </p>
                    <p className="text-sm text-gray-600">Note: This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="flex-1"
                            onClick={handleDeleteCategory}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : null}
                            {loading ? 'Deleting...' : 'Ok'}
                        </Button>
                    </div>
                    <FormError message={errorMessage} />
                </div>
            )}
        </Modal>
    );
}
