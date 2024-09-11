import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center border-b bg-accent px-5">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="p-2">
          <Button variant="ghost" aria-label="Home">
            <img className="h-full" src="/USOPCLogo.svg"></img>
          </Button>
        </div>
      </nav>
    </header>
  );
}
