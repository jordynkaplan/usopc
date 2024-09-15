import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Athlete } from "./pages/Athlete";
import { Header } from "./pages/Header";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AthleteComparison } from "./pages/Athlete-Comparison";
import { TooltipProvider } from "./components/ui/tooltip";

const queryClient = new QueryClient();

function App() {
    return (
        <TooltipProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                    <div className="bg-muted/40">
                        <Header></Header>
                        <div className="p-4 max-w-screen-2xl mx-auto">
                            <Router>
                                <Routes>
                                    <Route path="/" element={<Athlete />} />
                                    <Route
                                        path="/athlete-comparison"
                                        element={<AthleteComparison />}
                                    />
                                    <Route path="/" element={<Athlete />} />
                                </Routes>
                            </Router>
                        </div>
                    </div>
                </ThemeProvider>
            </QueryClientProvider>
        </TooltipProvider>
    );
}

export default App;
