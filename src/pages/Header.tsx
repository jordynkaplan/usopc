import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";

export function Header() {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <div className="p-2">
              <Button variant="ghost" size="icon" aria-label="Home">
                <img src="/USOPCLogo.svg"></img>
                <Triangle className="size-5 fill-foreground" />
              </Button>
            </div>
          </nav>
  );
}