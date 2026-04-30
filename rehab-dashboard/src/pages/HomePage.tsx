// src/pages/HomePage.tsx
import MainMenuCard from "../components/MainMenuCard";
import PreparationPanel from "../components/PreparationPanel";

const HomePage = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
      {/* Preparation Panel - Left */}
      <PreparationPanel />

      {/* Main Menu - Right */}
      <MainMenuCard />
    </div>
  );
};

export default HomePage;
