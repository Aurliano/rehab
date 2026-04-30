// src/components/MenuActionButton.tsx
import React from "react";
import type { MenuItem } from "../types";

const MenuActionButton: React.FC<MenuItem> = ({ title, icon: Icon, variant }) => {
  const base =
    "flex items-center justify-between w-full text-right rounded-xl px-5 py-4 font-medium focus-visible:outline-none focus-visible:ring-2 transition-all duration-200 cursor-pointer ";
  const primary =
    "bg-cyan-500 text-white shadow-md hover:bg-cyan-600 focus-visible:ring-cyan-300";
  const secondary =
    "bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/30";

  return (
    <button
      className={`${base} ${variant === "primary" ? primary : secondary}`}
      aria-label={title}
    >
      <span>{title}</span>
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default MenuActionButton;