"use client";

import { useRef, useEffect,useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Lock,Eye,EyeOff } from "lucide-react";

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
const [showPassword, setShowPassword] = useState(false);
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

        toast.success("Logged in successfully!");
        localStorage.setItem("userId", res.user.id);
        form.reset();
        await refreshUser();
        router.push("/home");
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
        className="space-y-6 max-w-sm mx-auto py-6  rounded-lg"      >
        <div className="flex justify-end  lg:mr-17">
          <img
            src="/buzz-1.png"
            alt="Logo"
            className="h-20 min-h-[5rem] w-auto object-contain"
          />
        </div>
        <h2 className="text-white text-xl font-bold text-center">Log in</h2>
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
                    className="auth-input pl-10"
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
        <h3 className="text-right -mt-6 text-white pt-2"><Link href='/forgot'>Forgot Password</Link></h3>

        <ReCAPTCHA ref={recaptchaRef} sitekey={siteKey} size="invisible" />

        <Button type="submit" className="w-full bg-[#372152]  text-white hover:bg-[#7554a1] hover:text-[#e4c8bb] font-bold mb-3 ">
          Login
        </Button>

        <h3 className="text-center font-medium my-4 mb-7 text-white">Or login with</h3>
        <Button
          onClick={handleGoogleLogin}
          className="bg-[#372152] w-full hover:bg-[#7554a1]"
        >
          Continue with Google
        </Button>
        <h3 className="text-center text-white"><Link href='/signup'>Don&apos;t have an account? Signup</Link></h3>
      </form>
    </Form>
  );
}
