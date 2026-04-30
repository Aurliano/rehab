// src/components/InfoCard.tsx
import React from "react";

interface InfoCardProps {
  title: string;
  info: [string, string][];
  badge?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, info, badge }) => {
  return (
    <div className="glass-card-hover bg-white/5 p-4 rounded-xl mb-4 border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">{title}</h3>
        {badge}
      </div>
      <ul className="space-y-1 text-white/80">
        {info.map(([label], i) => (
          <li key={i}>{label}</li>
        ))}
      </ul>
    </div>
  );
};

export default InfoCard;
