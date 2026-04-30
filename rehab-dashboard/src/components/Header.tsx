import React from "react";

const Header: React.FC = () => (
  <header className="text-center py-8 relative">
    <h1 className="text-4xl font-bold tracking-wide mb-1">
      سامانه توانبخشی{" "}
      <span
        className="text-cyan-400"
        style={{ textShadow: "0 0 30px rgba(0,229,255,0.8)" }}
      >
        سایدا
      </span>
    </h1>
    <p className="text-white/40 text-sm">داشبورد پزشک</p>
  </header>
);

export default Header;
