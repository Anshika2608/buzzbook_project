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
import Link from "next/link";
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
        className="space-y-6 w-full max-w-md mx-auto auth-bg py-6 px-6 rounded-lg shadow-lg shadow-[rgb(53,34,85)]"
      >
                  <h2 className="text-[#e4c8bb] text-xl font-bold">Log in</h2>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" className="auth-input"{...field} />
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
                <Input type="password" placeholder="••••••••" className="auth-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <h3 className="text-right -mt-6 "><Link  href='/forgot'>Forgot Password</Link></h3> 

        <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} size="invisible" />

        <Button type="submit" className="w-full bg-[#9b87d7] text-[#301656] hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold mb-3 mt-3">
          Login
        </Button>
       
        <h3 className="text-center font-medium my-4 mb-7">Or login with</h3>
        <Button
          onClick={handleGoogleLogin}
          className="auth-input w-full"
        >
          Continue with Google
        </Button>
         <h3 className="text-center"><Link href='/signup'>Dont have an account? Signup</Link></h3>
      </form>
    </Form>
  );
}
