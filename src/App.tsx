import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Individual } from "./pages/Individual";
import { Header } from "./pages/Header";

function App() {
  return (
    <>
    <Header></Header>
    <Router>
      <Routes>
        <Route path="/individual" element={<Individual />} />
        <Route path="/" element={<Individual />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
