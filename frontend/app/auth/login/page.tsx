"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { loading, user, isAuthenticated, error, Login} = useAuth();

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, error, loading]);

  async function submitHandler(e: FormEvent) {
    e.preventDefault();
    Login({ username: email, password });
  }
  return (

    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">خوش برگشتی</CardTitle>

          <CardDescription>وارد حساب کاربری خودت بشو</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={submitHandler}>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>

              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="ایمیل شما معتبر نیست"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">پسورد</Label>

                <Link
                  href="/password/reset"
                  className="text-sm text-primary hover:underline"
                >
                  رمزت رو فراموش کردی ؟
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              {loading ? "در حال ورود" : "ورود"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground gap-5">
            حساب نداری ؟
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              خب یدونه بساز
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
