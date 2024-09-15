import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-10 flex h-[57px] items-center border-b bg-background px-5">
            <nav className="flex items-center justify-between w-full">
                <Button variant="ghost" aria-label="Home" className="p-1">
                    <img
                        className="h-full"
                        src="/USOPCLogo.svg"
                        alt="USOPC Logo"
                    />
                </Button>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:gap-5 lg:gap-6">
                    <Button
                        variant="ghost"
                        aria-label="Athlete"
                        className="p-1 font-semibold text-lg"
                        onClick={() => (window.location.href = "/")}
                    >
                        Athlete
                    </Button>
                    <Button
                        variant="ghost"
                        aria-label="Athlete Comparison"
                        className="p-1 font-semibold text-lg"
                        onClick={() =>
                            (window.location.href = "/athlete-comparison")
                        }
                    >
                        Athlete Comparison
                    </Button>
                </div>

                {/* Mobile Menu */}
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild className="md:hidden">
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mt-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    window.location.href = "/";
                                    setOpen(false);
                                }}
                            >
                                Athlete
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    window.location.href =
                                        "/athlete-comparison";
                                    setOpen(false);
                                }}
                            >
                                Athlete Comparison
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>

                <ModeToggle />
            </nav>
        </header>
    );
}
