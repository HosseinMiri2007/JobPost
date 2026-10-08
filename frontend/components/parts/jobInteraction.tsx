// frontend/components/parts/jobInteraction.tsx
"use client";
import { useJob } from "@/context/JobContext";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";

export function JobInteraction({ id = "" }: { id: string }) {
  const { applytojob, applied, isApplied, setApplied ,loading} = useJob();
  
  const hasCheckedRef = useRef(false);

  // ✅ Add id to dependencies AND use ref to prevent infinite loop
  useEffect(() => {
    // Skip if no id or already checked
    if (!id || hasCheckedRef.current) return;

    async function checkApplied() {
      try {
        if (isApplied) {
          const result = await isApplied(id);
          if (setApplied && result !== undefined) {
            setApplied(result);
          }
          hasCheckedRef.current = true;
        }
      } catch (error) {
        console.error("Error checking application:", error);
      }
    }
    checkApplied();
  }, [id, isApplied, setApplied]);

  async function applyJobHandler() {
    if (!id) {
      console.error("❌ Cannot apply: ID is undefined");
      return;
    }

    if (applytojob) {
      await applytojob(id);
    }
  }

  return (
    <Button
      className="w-full h-11"
      size="lg"
      onClick={applyJobHandler}
      disabled={applied}
    >
      {loading
        ? "در حال بررسی..."
        : applied
          ? "✅ رزومه ارسال شده"
          : "📤 ارسال رزومه"}
    </Button>
  );
}
