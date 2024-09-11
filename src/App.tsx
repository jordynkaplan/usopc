import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Individual } from "./pages/Individual";
import { Header } from "./pages/Header";

function App() {
  return (
    <div className="bg-accent">
      <Header></Header>
      <div className="p-4">
        <Router>
          <Routes>
            <Route path="/individual" element={<Individual />} />
            <Route path="/" element={<Individual />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
