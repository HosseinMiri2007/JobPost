"use client";

import Link from "next/link";
import { useState } from "react";

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
import { RegisterUserType, UserType } from "@/types/auth_types";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [first_name, setfirst_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");

  type onChangeType = React.ChangeEvent<HTMLInputElement>;
  const { register } = useAuth();

  async function handleSubmit(e: onChangeType) {
    e.preventDefault();
    if (!first_name || !last_name || !email || !password) {
      return;
    }
    const user: RegisterUserType = {
      first_name,
      last_name,
      email,
      password,
    };
    await register(user);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>ایجاد حساب کاربری</CardTitle>

          <CardDescription>
            برای ساخت حساب کاربری، اطلاعات خود را وارد کنید.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">نام</Label>

                <Input
                  id="first_name"
                  name="first_name"
                  value={first_name}
                  onChange={(e: onChangeType) => setfirst_name(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">نام خانوادگی</Label>

                <Input
                  id="last_name"
                  name="last_name"
                  value={last_name}
                  onChange={(e: onChangeType) => setlast_name(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e: onChangeType) => setemail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>

              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e: onChangeType) => setpassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              ایجاد حساب کاربری
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              قبلاً حساب کاربری دارید؟
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                ورود
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
