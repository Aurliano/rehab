// src/components/EquipmentStatusItem.tsx
import React from "react";
import { Circle } from "lucide-react";

interface Props {
  name: string;
  status: "ready" | "warning" | "error";
  text: string;
}

const colorMap = {
  ready: "text-green-400",
  warning: "text-yellow-400",
  error: "text-orange-400",
};

const EquipmentStatusItem: React.FC<Props> = ({ name, status, text }) => {
  return (
    <div
      className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
      aria-label={`وضعیت ${name}: ${text}`}
    >
      <span className="flex items-center gap-2">
        <Circle className={`w-3 h-3 ${colorMap[status]}`} aria-hidden="true" />
        <span className="font-medium">{name}</span>
      </span>
      <span className="text-white/80">{text}</span>
    </div>
  );
};

export default EquipmentStatusItem;
