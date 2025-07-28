"use client";

// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { useParams } from "next/navigation";

// import {
//   ResetPasswordSchema,
//   ResetPasswordFormData,
// } from "@/lib/validation/ResetSchema";
// import resetPassword from "@/actions/reset";

// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// interface Props {
//   params: {
//     id: string;
//     token: string;
//   };
// }

// export default function NewPasswordPage({ params }: Props) {
  
//   const router = useRouter();
//   const form = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(ResetPasswordSchema),
//     defaultValues: {
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: ResetPasswordFormData) => {
//     const res = await resetPassword(data, params.id, params.token);

//     if (res.success) {
//       toast.success("✅ Password reset successful!");
//       router.push("/"); // Redirect to login or home page
//     } else if (res.fieldErrors) {
//       Object.entries(res.fieldErrors).forEach(([field, message]) =>
//         form.setError(field as keyof ResetPasswordFormData, { message })
//       );
//     } else {
//       toast.error(res.error?.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto py-10">
//       <h2 className="text-2xl font-semibold mb-6">Reset Your Password</h2>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>New Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" placeholder="Enter new password" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="confirmPassword"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Confirm New Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" placeholder="Confirm new password" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit" className="w-full">Reset Password</Button>
//         </form>
//       </Form>
//     </div>
//   );
// }



import { useParams } from 'next/navigation';
import ResetPasswordForm from '@/components/forms/ResetForm';

export default function Page() {
  const params = useParams();

  // Access `params.id` and `params.token` here
  const id = params?.id as string;
  const token = params?.token as string;

  return <ResetPasswordForm id={id} token={token} />;
}


