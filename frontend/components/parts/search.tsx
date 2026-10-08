import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { JobType } from "@/types/job_types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
export function Search({
  setJobs,
  setResPerPage,
  setCount,
}: {
  setJobs: Dispatch<SetStateAction<JobType[]>>;
  setResPerPage: Dispatch<SetStateAction<number>>;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  const [keyword, setKeyword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const router = useRouter();


  async function submitSearch(e: FormEvent) {
    e.preventDefault();
    if (keyword) {
      let searchQuery = `?keyword=${keyword}`;
      if (address) {
        searchQuery = searchQuery.concat(`&address=${address}`);
      }

      const req = await axios.get(`${process.env.API_URL}/api/job/`, {
        params: {
          keyword,
          address,
        },
      });
      const data = req.data;
      router.push(searchQuery);
      setJobs(data.job);
      setResPerPage(data.resperpage);
      setCount(data.count);
    } else {
      router.push("/");
    }
  }
  return (
    <>
      <form className="flex items-center gap-3" onSubmit={submitSearch}>
        <div>
          <Field orientation="horizontal" className="my-3">
            <Input
              type="search"
              placeholder="جستجو...."
              required
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Input
              type="search"
              placeholder="جستجو ، لوکیشن...."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Field>
        </div>
        <Button
          className="dark:bg-white dark:text-black dark:hover:bg-gray-300 bg-black text-white hover:bg-gray-800"
          type="submit"
        >
          جستجو
        </Button>
      </form>
    </>
  );
}
