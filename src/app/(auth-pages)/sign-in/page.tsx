"use client";

import { signInAction } from "@/app/actions/authActions";
import { FormMessage, Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Suspense } from "react";

const SignInPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignIn />
  </Suspense>
);

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const success = searchParams.get("success");

  let message: Message | null = null;
  if (error) {
    message = { error: error.toString() };
  } else if (success) {
    message = { success };
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true); // Set loading to true when the button is clicked
    const result = await signInAction(formData);
    setLoading(false); // Reset loading after the action is completed

  };

  return (
    <div className="w-screen flex items-center h-screen justify-center gap-2 p-4">
      <form
        className="flex flex-col min-w-64 max-w-64 mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleSubmit(formData);
        }}
      >
        <h1 className="text-2xl font-medium">Login</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            minLength={6}
            required
          />
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
          {message && <FormMessage message={message} />}
          <Button
            className="w-full mt-4"
            type="submit"
            disabled={loading} // Disable the button when loading
          >
            {loading ? "Logging in..." : "Login"} {/* Show loading text */}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
