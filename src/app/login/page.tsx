"use client";

import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    try {
      const { data, error } = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setSubmitError(error.message || "Invalid email or password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setSubmitError("Network connection failure. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-12 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl md:grid-cols-2">

        {/* Left Column: Brand Context Info */}
        <div className="relative flex flex-col justify-between bg-slate-900 p-8 text-white lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_50%)]" />

          <div className="relative z-10 space-y-6">
            <div>
              <span className="inline-flex items-center rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400 ring-1 ring-inset ring-sky-500/20">
                Welcome Back
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Pick up right where you left off.
              </h1>
              <p className="mt-4 text-base text-slate-300 leading-relaxed">
                Sign in to access your saved itineraries, landmarks, journals, and premium booking portals.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sky-500/20 text-sky-400 text-xs">✓</div>
                <p className="text-sm text-slate-300"><strong className="text-white">Smart Match Routing:</strong> Optimal routing recommendations curated via local adventure experts.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sky-500/20 text-sky-400 text-xs">✓</div>
                <p className="text-sm text-slate-300"><strong className="text-white">Live Operations:</strong> Dynamic schedule modifications synced directly across internal dashboards.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-4">
              Create one now
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to continue to Roamify</p>
          </div>

          <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
            {/* Email Field */}
            <TextField
              isRequired
              type="email"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
            >
              <Label className="text-sm font-medium text-slate-700">Email Address</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="mt-1"
              />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Password Field */}
            <TextField
              isRequired
              type="password"
              validate={(value) => {
                if (value.length < 1) {
                  return "Password is required";
                }
                return null;
              }}
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Password</Label>
                <Link href="/forgot-password" className="text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
              <FieldError className="text-xs text-red-500 mt-1" />
            </TextField>

            {/* Server Auth Error Feedback Banner */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium">
                {submitError}
              </div>
            )}

            {/* Login Action Button */}
            <div className="flex flex-col gap-2 mt-2">
              <Button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold flex items-center justify-center h-10 rounded-xl transition-colors"
                isDisabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Log In"}
              </Button>
            </div>
          </Form>
        </div>

      </div>
    </div>
  );
}