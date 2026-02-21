import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./Home";
import { DataProvider } from "./contexts/DataContext";
import Team  from "./components/Team";
import About from "./components/About";
import TeamLookup from "./components/TeamLookup";
import MatchPredictor from "./components/MatchPredict";

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lookup" element={<TeamLookup/>} />
        <Route path="/about" element={<About />} />
        <Route path="/teams/:teamNumber" element={<Team />} />
        <Route path="/predict" element={<MatchPredictor comingSoon={false}/>} />
      </Routes>
      <Analytics />
    </DataProvider>
  );
}

/*
 <Route path="/teams/:teamNumber" element={<Te />} />
        <Route path="/about" element={<About />} />
*/