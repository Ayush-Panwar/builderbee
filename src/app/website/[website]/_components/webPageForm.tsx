import { Button } from "@/components/ui/button";
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
import { checkPathName, upsertWebPage } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { WebPage } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";

type Props = { websiteId: string; create?: boolean; webPageDetails?: WebPage };
export const formSchema = z.object({
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

export default function WebPageForm({
  websiteId,
  create,
  webPageDetails,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: webPageDetails?.name ? webPageDetails.name : "",
      pathName: webPageDetails?.pathName ? webPageDetails?.pathName : "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (websiteId) {
      const checkPath = await checkPathName(websiteId, values.pathName);
      if (checkPath) {
        return toast.error("This Path already exist");
      }
      const response = create
        ? await upsertWebPage(v4(), values, websiteId)
        : webPageDetails
        ? await upsertWebPage(webPageDetails?.id, values, websiteId)
        : "";
      console.log(response);
      if (response && create) {
        router.push(`${websiteId}/editor/${response.id}`);
      }
      if (!create) {
        toast.success("Your Webpage is successfully updated.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WebPage Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public webpage name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pathName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Path Name</FormLabel>
              <FormControl>
                <Input placeholder="/" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public webpage path and it must be unique.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            form.formState.isLoading
          }
        >
          {create ? "Create" : "Update"}
        </Button>
      </form>
    </Form>
  );
}
