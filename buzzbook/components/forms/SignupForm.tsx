"use client";

import {useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { route } from "@/lib/api"
import api from "@/lib/interceptor"
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import OtpVerificationModal from "../modals/OtpVerificationModal";
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

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();
  const [otpOpen, setOtpOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
    },
  });



  const handleRecaptchaAndSubmit = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      const recaptchaToken = await recaptchaRef.current?.executeAsync();
      if (!recaptchaToken) {
        toast.error("reCAPTCHA failed, please try again");
        setIsLoading(false);
        return;
      }
      recaptchaRef.current?.reset();
      form.handleSubmit(async (data) => {

        try {
          const payload = {
            ...data,
            recaptchaToken,
          };
          await api.post(route.register, payload, { withCredentials: true }
          );
          toast.success("OTP sent to your email");
          setSignupEmail(data.email);
          setOtpOpen(true);
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            toast.error(
              (error.response?.data as { message?: string })?.message ||
              "Signup failed"
            );
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Unexpected error occurred");
          }
        }

      })();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRecaptchaAndSubmit();
          }}
          className="flex flex-col items-center justify-center space-y-3 mx-auto py-6  rounded-lg w-2xs">
          <div className="">
            <img
              src="/LogoF.png"
              alt="Logo"
              className="h-20 min-h-[5rem] w-auto object-contain "
            />
          </div>
          <h2 className="text-white text-xl font-bold text-center">Sign up</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-200 text-md">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a66b5] w-5 h-5" />
                    <Input
                      type="text"
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
              <FormItem className="w-full">
                <FormLabel className="text-white text-md">Email</FormLabel>
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
              <FormItem className="w-full">
                <FormLabel className="text-white text-md">Password</FormLabel>
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
              <FormItem className="w-full">
                <FormLabel className="text-white text-md">Confirm Password</FormLabel>
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
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500" />
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
          <h3 className="text-center text-white"> <Link href="/login">Already have an account ? Login
          </Link></h3>
        </form>

      </Form>
      <OtpVerificationModal
        open={otpOpen}
        onOpenChange={setOtpOpen}
        email={signupEmail}
        onSuccess={async () => {
          await refreshUser();
          router.push("/");
        }}
      />

    </>
  );
}

