import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 py-12">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#0ea5e9" },
        }}
        afterSignUpUrl="/practice"
        signInUrl="/sign-in"
      />
    </div>
  );
}
