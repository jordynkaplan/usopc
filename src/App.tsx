import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
// import { ApmRoutes as Routes } from "@elastic/apm-rum-react";
// import { ApmRoute as Route } from "@elastic/apm-rum-react";

import { Athlete } from "./pages/Athlete";
import { Header } from "./pages/Header";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AthleteComparison } from "./pages/Athlete-Comparison";
import { TooltipProvider } from "./components/ui/tooltip";
import "./rum";

const queryClient = new QueryClient();

function App() {
    return (
        <TooltipProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                    <Router>
                        <div className="bg-muted/40">
                            <Header></Header>
                            <div className="p-4 max-w-screen-2xl mx-auto">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Navigate
                                                to="/athlete/wellness"
                                                replace
                                            />
                                        }
                                    />
                                    <Route
                                        path="/athlete"
                                        element={
                                            <Navigate
                                                to="/athlete/wellness"
                                                replace
                                            />
                                        }
                                    />
                                    <Route
                                        path="/athlete/*"
                                        element={<Athlete />}
                                    />
                                    <Route
                                        path="/athlete-comparison/*"
                                        element={<AthleteComparison />}
                                    />
                                    <Route
                                        path="/athlete-comparison"
                                        element={<AthleteComparison />}
                                    />
                                    <Route path="/" element={<Athlete />} />
                                </Routes>
                            </div>
                        </div>
                    </Router>
                </ThemeProvider>
            </QueryClientProvider>
        </TooltipProvider>
    );
}

export default App;
