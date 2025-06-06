'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { ArrowRight } from 'lucide-react';
import githubIcon from '@/public/static/github-icon.svg';
import googleIcon from '@/public/static/google-icon.svg';

import Auth from '@/components/auth-wrapper';
import { LoadingSpinnerBtn } from '@/components/loading-spinner';

import { authenticate } from '@/actions/auth';
import { FormError } from '@/components/form-error';
import { InputField } from '@/components/custom-field';
import { FormSuccess } from '@/components/form-success';

import { SignInSchema, type SignInSchemaType } from '@/schema/auth';

export default function SignInForm() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different providers!' : '';

    const signInProvider = (provider: string) => {
        signIn(provider, {
            callbackUrl: callbackUrl || '/',
        });
    };

    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignInSchemaType) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const data = await authenticate(values);
            if (data?.error) {
                setError(data.error);
            } else if (data?.success) {
                setSuccess(data.success);
                form.reset();
            }
        });
    };

    return (
        <Auth
            className="container max-w-md"
            headerLabel="Sign In"
            footerLabel="Do not have an account ? "
            footerHref="/sign-up"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <InputField name="email" label="Email" placeholder="Please enter your email" />

                    <InputField
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Please enter your password"
                    />

                    <Link href="/forgot-password">
                        <span className="float-right my-4 text-xs text-blue-500 hover:text-blue-700">
                            You forgot password ?
                        </span>
                    </Link>

                    <Button className="w-full" aria-disabled={isPending} disabled={isPending} type="submit">
                        {isPending ? (
                            <LoadingSpinnerBtn />
                        ) : (
                            <>
                                <span className="dark:text-black">Sign In</span>
                                <ArrowRight className="ml-auto h-5 w-5" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            <div className="flex flex-col">
                <div className="pt-2">
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                </div>

                <div className="my-3 flex items-center justify-center">
                    <span className="w-full border border-b-black"></span>
                    <p className="mx-1">OR</p>
                    <span className="w-full border border-b-black"></span>
                </div>

                <div className="gap-2 max-md:grid max-md:grid-rows-2 md:grid md:grid-cols-2">
                    <Button className="h-12 md:h-16" variant={'outline'} onClick={() => signInProvider('google')}>
                        <Image src={googleIcon} alt="google icon" width={30} height={30} priority />
                    </Button>
                    <Button className="h-12 md:h-16" variant={'outline'} onClick={() => signInProvider('github')}>
                        <Image src={githubIcon} alt="github icon" width={30} height={30} priority />
                    </Button>
                </div>
            </div>
        </Auth>
    );
}
