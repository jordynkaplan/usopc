import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

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
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Athlete
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to="/athlete/wellness"
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                <div className="text-sm font-medium leading-none">
                                                    Wellness
                                                </div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Individual athlete wellness
                                                    analysis
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to="/athlete/results"
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                <div className="text-sm font-medium leading-none">
                                                    Results
                                                </div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Individual athlete result
                                                    analysis
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Athlete Comparison
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to="/athlete-comparison/wellness"
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                <div className="text-sm font-medium leading-none">
                                                    Wellness
                                                </div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Wellness analysis across
                                                    athletes
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to="/athlete-comparison/results"
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                <div className="text-sm font-medium leading-none">
                                                    Results
                                                </div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Results analysis across
                                                    athletes
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

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
                                    navigate("/athlete/wellness");
                                    setOpen(false);
                                }}
                            >
                                Athlete Wellness
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    navigate("/athlete/results");
                                    setOpen(false);
                                }}
                            >
                                Athlete Results
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    navigate("/athlete-comparison/wellness");
                                    setOpen(false);
                                }}
                            >
                                Comparison Wellness
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => {
                                    navigate("/athlete-comparison/results");
                                    setOpen(false);
                                }}
                            >
                                Comparison Results
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>

                <ModeToggle />
            </nav>
        </header>
    );
}
