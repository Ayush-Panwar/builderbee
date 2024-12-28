"use client";

import { FormEventHandler, useEffect, useState } from "react";

import { toast } from "sonner";
import { useRenameModal } from "../../../../../store/use-rename-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/file-upload";
import { checkSubDomain, updateWebsiteDetails } from "@/lib/queries";
import { useWebsitesData } from "../../../../../store/useWebsitesData";

const formSchema = z.object({
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

export const EditModal = () => {
  const { isOpen, onClose, initialValues } = useRenameModal();
  const { websites, setWebsites } = useWebsitesData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues.name,
      subDomain: initialValues.subDomain,
      favicon: initialValues.favicon,
    },
  });
  const { control } = form;
  const { dirtyFields } = useFormState({ control });
  const isDirty = Object.keys(dirtyFields);

  useEffect(() => {
    form.reset({
      name: initialValues.name,
      subDomain: initialValues.subDomain,
      favicon: initialValues.favicon,
    });
  }, [initialValues]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isDirty.includes("subDomain")) {
      const subDomain_exist = await checkSubDomain(values.subDomain);
      if (subDomain_exist) {
        return toast.error("Subdomain Already Exist");
      }
    }
    const response = await updateWebsiteDetails(initialValues.id, values);
    // const homePage = await upsertWebPage(
    //   v4(),
    //   { name: "Home", pathName: "" },
    //   response.id
    // );
    if (response) {
      toast.success("Website Details changed Successfully");
      console.log(response);
      setTimeout(() => {
        const newWebsiteData = websites.map((website) =>
          website.id === response.id ? response : website
        );
        setWebsites(newWebsiteData);

        onClose();
      }, 1000);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Website Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website name</FormLabel>
                  <FormControl>
                    <Input placeholder="website" {...field} />
                  </FormControl>

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
            <Button type="submit">Edit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
