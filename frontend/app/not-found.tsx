import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-xl rounded-2xl shadow-md">
        <CardContent className="py-12 flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
            <SearchX className="w-12 h-12 text-blue-600" />
          </div>

          <h1 className="text-6xl font-extrabold text-blue-600">404</h1>

          <h2 className="mt-4 text-2xl font-bold">صفحه مورد نظر پیدا نشد</h2>

          <p className="mt-3 text-muted-foreground leading-7 max-w-md">
            ممکن است آگهی حذف شده باشد، آدرس اشتباه وارد شده باشد یا صفحه مورد
            نظر وجود نداشته باشد.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/">بازگشت به صفحه اصلی</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/job">مشاهده فرصت‌های شغلی</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
