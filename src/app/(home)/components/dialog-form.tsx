import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { checkSubDomain, createWebsite, upsertWebPage } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";

type Props = { children: React.ReactNode };

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "website must be at least 5 characters.",
  }),
  subDomain: z
    .string()
    .min(2, {
      message: "Subdomain must be at least 3 characters.",
    })
    .max(15, {
      message: "Subdomain can be max 15 characters.",
    })
    .refine((val) => !/\s/.test(val), {
      message: "Subdomain must not contain non-spacing characters",
    }),
  favicon: z.string().optional(),
});

export default function DialogForm({ children }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subDomain: "",
      favicon: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const subDomain_exist = await checkSubDomain(values.subDomain);
    if (subDomain_exist) {
      return toast.error("Subdomain Already Exist");
    }

    const response = await createWebsite(v4(), values, session?.user.id);
    const homePage = await upsertWebPage(
      v4(),
      { name: "Home", pathName: "" },
      response.id
    );
    if (response) {
      router.push(`/website/${response.id}`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        {children}
        {/* <div className="flex flex-col gap-2 ">
          <Card className="group w-56 h-56 shadow hover:shadow-lg bg-white flex items-center justify-center hover:fill-sky-500">
            <Plus
              size={75}
              stroke="grey"
              className="group-hover:stroke-sky-300 "
            />
          </Card>
          <div className="textsm pl-2 font-xs">Build New Website</div>
        </div> */}
      </DialogTrigger>
      <DialogContent className="overflow-auto max-h-[97vh]">
        {session?.user ? (
          <>
            <DialogHeader>
              <DialogTitle>Create your Website</DialogTitle>
              <DialogDescription>
                Website are the collection of web pages .
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>website name</FormLabel>
                      <FormControl>
                        <Input placeholder="website" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public website name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdomain</FormLabel>
                      <FormControl>
                        <Input placeholder="subdomain" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public subdomain and it must be unique.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="favicon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon</FormLabel>
                      <FormControl>
                        <FileUpload
                          apiEndpoint="subDomain"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create</Button>
              </form>
            </Form>
          </>
        ) : (
          <>
            <h1 className="font-bold text-2xl">Sign In Required</h1>
            <h3>🚧 Access Restricted</h3>
            <p className="text-muted-foreground">
              You need to sign in to your account to start building or editing
              your website.
            </p>
            <Button
              onClick={() => signIn("google")}
              className="flex justify-center gap-4"
            >
              <Image
                src={"/google_login.svg"}
                width="20"
                height="20"
                alt="google_login"
              ></Image>
              Sign In with Google
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
