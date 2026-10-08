"use client";

import {
  CreditCardIcon,
  LogOutIcon,
  PaperBag,
  Paperclip,
  Pencil,
  PencilLine,
  SettingsIcon,
  StickyNote,
  User,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserType } from "@/types/auth_types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type dropdownUser = {
  user: UserType;
};

export function DropdownMenuIcons({ user }: dropdownUser) {
  const router = useRouter();

  const { Logout } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-5 cursor-pointer bg-gray-50 outline-none border border-gray-400 rounded-md p-3">
          <User />
          <span>
            {user.first_name} {user.last_name}
          </span>
          <span className="font-bold">˅</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-50">
        <DropdownMenuItem asChild>
          <Link href={"/uploadresume/"} className="flex items-center gap-3">
            <StickyNote />
            آپلود رزومه
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/auth/updateuser/"} className="flex items-center gap-3">
            <Pencil />
            آپدیت پروفایل
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/auth/dashboard/"} className="flex items-center gap-3">
            <UserIcon />
            داشبورد
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={Logout}>
          <LogOutIcon />
          خروج از حساب
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
