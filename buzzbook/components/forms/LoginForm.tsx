"use client";

import { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

import { LoginSchema, LoginFormData } from "@/lib/validation/Loginschema";
import login from "@/actions/login";
import { useAuth } from "@/app/context/AuthContext";
const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function LoginForm() {
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

const { refreshUser } = useAuth();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      recaptchaToken: "",
    },
  });
  const handleGoogleLogin = () => {
    window.location.href = "https://buzzbook-server-dy0q.onrender.com/auth/google";

  };
  useEffect(() => {
    form.register("recaptchaToken");
  }, [form]);

  const handleRecaptchaAndSubmit = async () => {
    const recaptchaValue = await recaptchaRef.current?.executeAsync();

    if (!recaptchaValue) {
      toast.error("reCAPTCHA failed, please try again");
      return;
    }

    form.setValue("recaptchaToken", recaptchaValue);
    recaptchaRef.current?.reset();

form.handleSubmit(async (data) => {
  const res = await login(data);

  if (res.success) {
    toast.success("✅ Logged in successfully!");
    form.reset();
    await refreshUser();
    router.push("/dashboard");
  } else if (res.fieldErrors) {
    Object.entries(res.fieldErrors).forEach(([field, message]) =>
      form.setError(field as keyof LoginFormData, { message })
    );
  } else {
    toast.error(res.error?.message || "Login failed");
  }
})();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRecaptchaAndSubmit();
        }}
        className="space-y-6 w-full max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} size="invisible" />

        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Continue with Google
        </Button>
      </form>
    </Form>
  );
}
