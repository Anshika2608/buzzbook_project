import ForgotPasswordForm from "@/components/forms/ForgotForm";

export default function ForgotPasswordPage() {
  return (
    <div className="py-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <ForgotPasswordForm />
    </div>
  );
}