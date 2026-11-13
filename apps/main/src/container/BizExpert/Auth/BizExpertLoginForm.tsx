"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bizExpertLoginCardClass } from "./bizExpertLoginClasses";
import {
  bizExpertLoginSchema,
  readBizExpertLoginError,
  type BizExpertLoginFormData,
} from "./bizExpertLoginSchema";

export function BizExpertLoginForm() {
  const { login } = useBizExpertAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BizExpertLoginFormData>({
    resolver: zodResolver(bizExpertLoginSchema),
  });

  const onSubmit = async (data: BizExpertLoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
    } catch (err: unknown) {
      toast.error(readBizExpertLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={bizExpertLoginCardClass}>
      <div className="flex flex-col gap-y-2 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600">
          Sign in to manage inventory, sales, and stores.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@business.com"
          />
          {errors.email && (
            <p className="text-xs text-error-primary">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-xs text-error-primary">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          className="mt-2 w-full"
          isLoading={loading}
        >
          Sign in
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/onboarding/business"
          className="font-semibold text-brand-600 hover:underline"
        >
          Create a business
        </Link>
      </p>
    </form>
  );
}
