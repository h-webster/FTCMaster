import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./Home";
import { DataProvider } from "./contexts/DataContext";
import Team  from "./components/Team";
import About from "./components/About";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/teams/:teamNumber" element={<Team />} />
      </Routes>
      <Analytics />
    </DataProvider>
  );
}

/*
 <Route path="/teams/:teamNumber" element={<Te />} />
        <Route path="/about" element={<About />} />
*/