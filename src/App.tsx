import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Individual } from "./pages/Individual";
import { Header } from "./pages/Header";
import { ThemeProvider } from "./components/theme-provider";
import { CustomHeatmap } from "./components/custom-heatmap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <div className="bg-muted/40">
                    <Header></Header>
                    <div className="p-4">
                        <Router>
                            <Routes>
                                <Route
                                    path="/individual"
                                    element={<Individual />}
                                />
                                <Route
                                    path="/corr"
                                    element={<CustomHeatmap />}
                                />
                                <Route path="/" element={<Individual />} />
                            </Routes>
                        </Router>
                    </div>
                </div>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
