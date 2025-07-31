"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import forgot from "@/actions/forgot";
import {
  ForgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validation/ForgotSchema";

export default function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const res = await forgot(data);

    if (res.success) {
      toast.success("Password reset link sent to your email.");
      form.reset();
    } else {
      toast.error(res.error.message || "Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md mx-auto auth-bg py-6 px-6 rounded-lg shadow-lg shadow-[rgb(53,34,85)] min-h-1/2 h-72"
      >
        <h2 className="text-[#e4c8bb] text-xl font-bold">Forgot password</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  className="auth-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-[#9b87d7] text-[#301656] hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold mb-3 mt-3">
          Send Reset Link
        </Button>
        <Link href='/login'><Button>Back to Login</Button></Link>
      </form>
    </Form>
  );
}

