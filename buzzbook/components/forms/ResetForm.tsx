'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema, ResetPasswordFormData } from '@/lib/validation/ResetSchema';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import resetPassword from '@/actions/reset';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

interface Props {
  id: string;
  token: string;
}

export default function ResetPasswordForm({ id, token }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    startTransition(async () => {
      const result = await resetPassword(data, id, token);

      if (result.success) {
        toast.success(result.message);
        router.push('/');
      } else if (result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          form.setError(key as keyof ResetPasswordFormData, { message });
        }
      } else if (result.error) {
        toast.error(result.error.message);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Reset Your Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Re-enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
