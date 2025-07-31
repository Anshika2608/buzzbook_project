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
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6 w-full max-w-md mx-auto auth-bg py-6 px-6 rounded-lg shadow-lg shadow-[rgb(53,34,85)]">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field}  className='auth-input'
                  />
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
                  <Input type="password" placeholder="Re-enter password" {...field}  className='auth-input' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full bg-[#9b87d7] text-[#301656] hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold mb-3 mt-3">
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
  );
}
