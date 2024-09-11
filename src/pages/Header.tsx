import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center border-b bg-background px-5">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
        <div className="p-2">
          <Button variant="ghost" aria-label="Home" className="p-1">
            <img className="h-full" src="/USOPCLogo.svg"></img>
          </Button>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
