"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenuIcons } from "./dropdown";
import CustomDropMenu from "./customdropmenu";

export default function Header({ img = null }: { img: string | null }) {
  const { user, loading } = useAuth();

  return (
    <header
      className="
      flex justify-between items-center
      [&>a]:flex [&>a]:items-center
      [&>a]:gap-2
      [&>div]:flex [&>div]:items-center
      px-4 py-5 dark:bg-zinc-800 bg-gray-300
      "
    >
      <Link href={"/"}>
        <div>
          <img src="/vercel.svg" alt="jobee logo" width={30} height={30} />
        </div>
        <span>شغلی</span>
      </Link>
      <div className="gap-5">
        <Link href='/job/add/'>
          <Button>اگهی پست کن</Button>
        </Link>
        {img ? (
          <img
            src={img}
            alt="the user profile image"
            className="cursor-pointer"
          />
        ) : (
          <Link href={"auth/register/"}>
            {user ? (
              <div>
                <DropdownMenuIcons user={user} />
              </div>
            ) : (
              !loading && (
                <Button className="bg-blue-200 text-black hover:bg-blue-400 border border-blue-700">
                  ثبت نام
                </Button>
              )
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
