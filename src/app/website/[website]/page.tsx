"use client";
import Navbar from "@/components/navbar/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  checkPathName,
  getWebsiteDetails,
  publishWebsite,
  upsertWebPage,
} from "@/lib/queries";
import { Website } from "@/types/editor_types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";
import WebPageCard from "./_components/webPageCard";
import { useSession } from "next-auth/react";
import WebPageForm from "./_components/webPageForm";

export interface WebsiteDashBoardProps {
  params: {
    website: string;
  };
}

 const formSchema = z.object({
  name: z.string().min(1, {
    message: "WebPage must be at least 1 characters.",
  }),
  pathName: z
    .string()
    .max(15, {
      message: "Path Name can be max 15 characters.",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Path must not contain non-spacing characters",
    }),
});

export default function WebsiteDashBoard({ params }: WebsiteDashBoardProps) {
  const [websiteData, setWebsiteData] = useState<Website>();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const getWebsite = async () => {
      if (!params.website) {
        return;
      }
      const response = await getWebsiteDetails(params.website);

      if (response) {
        setWebsiteData(response);
      }
    };
    getWebsite();
  }, [params.website]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (websiteData) {
      const checkPath = await checkPathName(websiteData.id, values.pathName);
      if (checkPath) {
        return toast.error("This Path already exist");
      }
      const response = await upsertWebPage(v4(), values, websiteData.id);
      console.log(response);
      if (response) {
        router.push(`${websiteData.id}/editor/${response.id}`);
      }
    }
  }

  async function handlePublishChange(checked: boolean) {
    const response = await publishWebsite(params.website, checked);
    if (response) {
      setWebsiteData((prev) => {
        if (!prev) return;
        return { ...prev, published: checked };
      });
      checked
        ? toast.success("Your Website is now successfully published.")
        : toast.success("Your Website has been removed from publication.");
    } else {
      toast.error("Failed to publish your Website");
    }
  }

  console.log(
    "isValid",
    form.formState.isValid,
    "isDirty",
    form.formState.isDirty,
    "isSubmitting",
    form.formState.isSubmitting,
    "isLoading",
    form.formState.isLoading
  );
  return (
    <div>
      <Navbar />

      <Link href="/">
        <Button variant="ghost" className="items-center m-8">
          <ChevronLeft />
          Back
        </Button>
      </Link>

      <div className="h-full w-full p-10 text-lg ">
        <div className="flex flex-row justify-between">
          <div className="font-bold text-6xl translate-y-[-3rem]">
            {websiteData?.name}
          </div>
          <div className="flex flex-row mr-10  gap-2 bg-muted p-4 rounded-lg font-semibold">
            <Switch
              checked={websiteData?.published}
              onCheckedChange={handlePublishChange}
            />
            Publish Website
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex flex-row gap-2 font-semibold">
              Create Webpage
              <Plus strokeWidth={3} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create your WebPage</DialogTitle>
            </DialogHeader>

            {websiteData ? (
              <WebPageForm websiteId={websiteData?.id} create />
            ) : (
              ""
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-6 flex flex-row gap-4">
          {websiteData
            ? websiteData?.webPages.map((webpage) => (
                <WebPageCard
                  key={webpage.id}
                  userId={session?.user?.id}
                  webPageDetails={webpage}
                  websiteId={params.website}
                  published={websiteData?.published}
                  websiteName={websiteData?.name}
                />
              ))
            : ""}
        </div>
      </div>
    </div>
  );
}
