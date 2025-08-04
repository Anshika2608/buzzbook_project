"use client";

import { useRef, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
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
import { SignupSchema, SignupFormData } from "@/lib/validation/SignUpschema";
import register from "@/actions/signup";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      recaptchaToken: "",
    },
  });

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

      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key as keyof SignupFormData]);
      }
      formData.set("recaptchaToken", recaptchaValue || "");
      const res = await register(data);
      if (res.success) {
        toast.success("🎉 Account created!");
        form.reset();
      } else if (res.fieldErrors) {
        Object.entries(res.fieldErrors).forEach(([field, message]) =>
          form.setError(field as keyof SignupFormData, { message })
        );
      } else {
        toast.error(res.error?.message || "Something went wrong");
      }
    })();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRecaptchaAndSubmit();
          }}
          className="space-y-6 max-w-sm mx-auto py-6  rounded-lg"
        >
          <div className="flex justify-end  lg:mr-17">
            <img
              src="/buzz-1.png"
              alt="Logo"
              className="h-20 min-h-[5rem] w-auto object-contain"
            />
          </div>
          <h2 className="text-white text-xl font-bold text-center">Sign up</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                    <Input
                      type="email"
                      className="auth-input pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                    <Input
                      type="email"
                      className="auth-input pl-10"
                      {...field}
                    />
                  </div>
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
                <FormLabel className="text-white text-lg">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="auth-input pl-10 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a66b5] cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="auth-input pl-10 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a66b5] cursor-pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            size="invisible"
          />

          <Button type="submit" className="w-full bg-[#372152]  text-white hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold mb-3">
            Sign up
          </Button>
          <h3 className="text-center text-white"> <Link href="/login">Already have an account ? Login
          </Link></h3>
        </form>

      </Form>
    </>
  );
}

