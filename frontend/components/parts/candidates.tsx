import { UserType } from "@/types/auth_types";
import { User } from "lucide-react";
import React from "react";

export default function Candidates({
  candidates,
}: {
  candidates: UserType | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <User className="text-blue-600" />
      <div className="text-sm text-foreground ">
        <span className="ml-2">{candidates}</span>
        <span>نفر برای این شغل رزومه فرستاده</span>
      </div>
    </div>
  );
}
