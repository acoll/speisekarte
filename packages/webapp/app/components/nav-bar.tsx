/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/OoTC6qLZvE2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { SignedIn, UserButton } from "@clerk/remix";
import { Link } from "@remix-run/react";
import { SVGProps } from "react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm px-4">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" prefetch="intent">
          <img src="/logo.png" className="h-6 w-6" alt="Speisekarte" />
          <span className="sr-only">Recipe App</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium hover:underline hover:underline-offset-4"
            prefetch="intent"
          >
            This Week
          </Link>
          <Link
            to="/recipes"
            className="text-sm font-medium hover:underline hover:underline-offset-4"
            prefetch="intent"
          >
            All Recipes
          </Link>
          <Link
            to="/recipes/new"
            className="text-sm font-medium hover:underline hover:underline-offset-4"
            prefetch="intent"
          >
            Add Recipe
          </Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-6 p-6">
              <Link
                to="/"
                className="flex items-center gap-2"
                prefetch="intent"
              >
                <img src="/logo.png" className="h-6 w-6" alt="Speisekarte" />
                <span className="text-lg font-semibold">Recipe App</span>
              </Link>
              <nav className="grid gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm font-medium hover:underline hover:underline-offset-4"
                  prefetch="intent"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Weekly Meals
                </Link>
                <Link
                  to="/recipes"
                  className="flex items-center gap-2 text-sm font-medium hover:underline hover:underline-offset-4"
                  prefetch="intent"
                >
                  <ListIcon className="h-5 w-5" />
                  All Recipes
                </Link>
                <Link
                  to="/recipes/new"
                  className="flex items-center gap-2 text-sm font-medium hover:underline hover:underline-offset-4"
                  prefetch="intent"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Recipe
                </Link>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
