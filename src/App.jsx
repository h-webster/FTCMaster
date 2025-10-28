import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import { DataProvider } from "./contexts/DataContext";
import Team  from "./components/Team";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams/:teamNumber" element={<Team />} />
      </Routes>
    </DataProvider>
  );
}

/*
 <Route path="/teams/:teamNumber" element={<Te />} />
        <Route path="/about" element={<About />} />
*/