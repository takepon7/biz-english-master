import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 py-12">
      <SignIn
        appearance={{
          variables: { colorPrimary: "#0ea5e9" },
        }}
        afterSignInUrl="/practice"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
