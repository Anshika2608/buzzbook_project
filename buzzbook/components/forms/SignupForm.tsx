
"use client";

import { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
          className="space-y-6 w-full max-w-md mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Anshika Mittal" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="anshika@example.com" {...field} />
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
          <FormField
            control={form.control}
            name="cpassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
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

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        
      </Form>
    </>
  );
}

