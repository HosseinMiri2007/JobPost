"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

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
import { toast } from "react-toastify";

export default function UpdateProfile() {
  const [first_name, setfirst_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [username, setUsername] = useState<string>(email);
  const [password, setpassword] = useState<string>("");

  type onChangeType = React.ChangeEvent<HTMLInputElement>;
  const { loading, user, error, updateuser } = useAuth();

  useEffect(() => {
    if (user) {
      async function setDefaults() {
        setfirst_name(user?.first_name || "");
        setlast_name(user?.last_name || "");
        setemail(user?.email || "");
        setUsername(user?.username || "");
        setpassword(user?.password || "");
      }
      setDefaults();
    }
  }, [user]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      updateuser({
        first_name,
        last_name,
        email,
        password,
        username,
      });
    } catch (error) {
      console.log("error comming from updateuser button function", error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>آپدیت حساب کاربری</CardTitle>

          <CardDescription>
            برای آپدیت حساب کاربری، اطلاعات جدید خود را وارد کنید.
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">نام خانوادگی</Label>

                <Input
                  id="last_name"
                  name="last_name"
                  value={last_name}
                  onChange={(e: onChangeType) => setlast_name(e.target.value)}
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
                onChange={(e: onChangeType) => {
                  setemail(e.target.value);
                  setUsername(e.target.value);
                }}
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
              />
            </div>
            <Button type="submit" className="w-full">
              آپدیت حساب کاربری
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
