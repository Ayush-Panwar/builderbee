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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { WebPage } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import TabList from "./tabList";
import Image from "next/image";
import WebPageForm from "./webPageForm";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteWebPage } from "@/lib/queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  webPageDetails: WebPage;
  websiteId: string;
  published: boolean;
  websiteSubDomain: string;
}

export default function WebPageCard({
  userId,
  webPageDetails,
  websiteId,
  published,
  websiteSubDomain,
}: Props) {
  console.log(
    webPageDetails.published,
    published,
    webPageDetails.published && published,
    webPageDetails.name
  );

  const router = useRouter();

  const handleDelete = async (webpageId: string) => {
    const response = await deleteWebPage(webpageId);
    if (response) {
      toast.success("Your Webpage is successfully deleted.");
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Link
          href={`/website/${websiteId}/editor/${webPageDetails.id}`}
          key={webPageDetails.id}
        > */}
        <Card className="h-46 w-46 shadow hover:shadow-lg relative group">
          <CardHeader>
            <CardTitle>{webPageDetails.name}</CardTitle>
            <CardDescription>
              <p>Path: /{webPageDetails.pathName}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Visits :{webPageDetails.visits}</p>
          </CardContent>
          <CardFooter className="flex gap-2  item-center">
            <div
              className={clsx("rounded-full h-3 w-3 bg-red-700", {
                "!bg-green-500": published && webPageDetails.published,
              })}
            ></div>
            <p>
              {published && webPageDetails.published
                ? "Published "
                : "Not Published"}
            </p>
          </CardFooter>
        </Card>
        {/* </Link> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Tabs defaultValue="account" className="w-[400px] flex  ">
          <TabList />
          <TabsContent value="Editor">
            <Card>
              <CardHeader>
                <CardTitle>Build Your WebPage</CardTitle>
                <CardDescription>
                  Create and customize your unique webpage with intuitive design
                  tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Image
                  src="https://follows-bc85.kxcdn.com/blog/wp-content/uploads/2017/11/Twitter-Cards-Illustration.jpg"
                  width={500}
                  height={500}
                  alt="Skeleton image"
                  className="mb-5"
                />
                <div className="flex flex-row items-center justify-between">
                  <Link
                    href={`http://${websiteSubDomain}.${process.env.NEXT_PUBLIC_DOMAIN}/${webPageDetails.pathName}`}
                    target="_blank"
                    className={clsx({
                      " pointer-events-none": !(
                        webPageDetails.published && published
                      ),
                    })}
                  >
                    <span
                      className={clsx(
                        "text-blue-700 cursor-pointer text-sm hover:text-blue-400 underline",
                        {
                          " !text-gray-900 !hover:text-red-400": !(
                            webPageDetails.published && published
                          ),
                        }
                      )}
                    >{`http://${websiteSubDomain?.toLocaleLowerCase()}.${
                      process.env.NEXT_PUBLIC_DOMAIN
                    }/${webPageDetails.pathName}`}</span>
                  </Link>
                </div>
                <div className=" flex flex-row items-center justify-between ">
                  <span>Name: </span>
                  <b> {webPageDetails.name}</b>
                </div>
                <div className="flex flex-row items-center justify-between ">
                  <span>Path: </span>
                  <p>/{webPageDetails.pathName}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/website/${websiteId}/editor/${webPageDetails.id}`}
                >
                  <Button>Open Editor</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Settings">
            <Card>
              <CardHeader>
                <CardTitle>Edit your WebPage Details.</CardTitle>
                <CardDescription>Edit your webpage Details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="path_name">Path Name</Label>
                  <Input id="path_name" type="text" />
                </div> */}
                <WebPageForm
                  websiteId={websiteId}
                  webPageDetails={webPageDetails}
                />
              </CardContent>
              {/* <CardFooter>
                <Button>Save Details</Button>
              </CardFooter> */}
            </Card>
          </TabsContent>
          <TabsContent value="Delete">
            <Card>
              <CardHeader>
                <CardTitle>Are you absolutely sure?</CardTitle>
                <CardDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardFooter className="justify-end pr-0">
                  <DialogPrimitive.Close>
                    <Button variant={"outline"} className="mr-5">
                      Cancel
                    </Button>
                  </DialogPrimitive.Close>
                  <Button
                    onClick={() => {
                      handleDelete(webPageDetails.id);
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
