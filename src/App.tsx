import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Individual } from "./pages/Individual";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/individual" element={<Individual />} />
        <Route path="/" element={<Individual />} />
      </Routes>
    </Router>
  );
}

export default App;
