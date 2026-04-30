// src/components/MainMenuCard.tsx
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Database,
  CalendarClock,
  PlayCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  variant: "primary" | "secondary";
  path: string;
}

const MainMenuCard = () => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: "add",
      title: "ثبت مشخصات بیمار",
      icon: UserPlus,
      variant: "secondary",
      path: "/add-patient",
    },
    {
      id: "list",
      title: "لیست بیماران",
      icon: Database,
      variant: "secondary",
      path: "/patient-selection",
    },
    {
      id: "schedule",
      title: "زمان‌بندی جلسات",
      icon: CalendarClock,
      variant: "secondary",
      path: "/schedule",
    },
    {
      id: "start",
      title: "شروع جلسه توانبخشی",
      icon: PlayCircle,
      variant: "primary",
      path: "/start-session",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-8 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        منوی اصلی
      </h2>

      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center                 gap-4 p-4 rounded-xl
                transition-all duration-300 group
                ${
                  item.variant === "primary"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/50"
                    : "bg-white/10 hover:bg-white/20 border border-white/20"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                  p-3 rounded-lg transition-all
                  ${
                    item.variant === "primary"
                      ? "bg-white/20 group-hover:bg-white/30"
                      : "bg-white/10 group-hover:bg-white/20"
                  }
                `}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <span className="text-lg font-semibold text-white flex-1 text-right">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainMenuCard;
