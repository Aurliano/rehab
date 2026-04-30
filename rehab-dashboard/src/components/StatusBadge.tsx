// src/components/StatusBadge.tsx
import React from "react";

interface Props {
  status: string;
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  return (
    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium">
      {status}
    </span>
  );
};

export default StatusBadge;
