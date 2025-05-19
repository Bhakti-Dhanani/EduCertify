import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Menu, School, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <School className="h-6 w-6" />
            <span className="hidden md:inline-block">Learning Platform</span>
          </Link>
          <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
            <Link
              href={ROUTES.COURSES.INDEX}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Courses
            </Link>
            <Link
              href="/features"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden lg:flex">
              <Link href={ROUTES.SIGN_IN}>Sign In</Link>
            </Button>
            <Button asChild className="hidden lg:flex">
              <Link href={ROUTES.SIGN_UP}>Get Started</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 font-semibold py-4">
                    <School className="h-6 w-6" />
                    <span>Learning Platform</span>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link
                      href={ROUTES.COURSES.INDEX}
                      className="text-foreground transition-colors hover:text-foreground/80 text-lg"
                    >
                      Courses
                    </Link>
                    <Link
                      href="/features"
                      className="text-foreground transition-colors hover:text-foreground/80 text-lg"
                    >
                      Features
                    </Link>
                    <Link
                      href="/pricing"
                      className="text-foreground transition-colors hover:text-foreground/80 text-lg"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/about"
                      className="text-foreground transition-colors hover:text-foreground/80 text-lg"
                    >
                      About
                    </Link>
                  </nav>
                  <div className="mt-auto space-y-4 pb-6">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={ROUTES.SIGN_IN}>Sign In</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href={ROUTES.SIGN_UP}>Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}