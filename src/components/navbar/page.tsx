"use client";
import { Hammer, LucideHammer } from "lucide-react";
import * as React from "react";
import { ModeToggle } from "../theme_toggle";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

type Pros = {};
const Navbar = (pros: Pros) => {
  const { data: session } = useSession();
  return (
    <div className="h-16 bg-background p-3 flex item-center justify-between px-16 ">
      <Link href="/" className="flex items-center">
        <div className="text-3xl text-amber-400 font-extrabold">Builder</div>
        <div className="text-3xl  font-extrabold">Bee</div>
      </Link>
      <div className="flex gap-4 ">
        <ModeToggle />
        {session?.user ? (
          <Button onClick={() => signOut()}>SignOut</Button>
        ) : (
          <Button className="bg-primary" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
