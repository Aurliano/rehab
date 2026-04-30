import React from "react";
import EquipmentStatusItem from "./EquipmentStatusItem";
import { usePatient } from "../contexts/PatientContext";

const PreparationPanel: React.FC = () => {
  const { selectedPatient } = usePatient();

  const equipmentStatuses: Array<{
    name: string;
    status: "ready" | "warning" | "error";
    text: string;
  }> = [
    { name: "دوربین", status: "ready", text: "آماده" },
    { name: "میکروفون", status: "ready", text: "آماده" },
    { name: "اتصال شبکه", status: "ready", text: "پایدار" },
    { name: "نمایشگر", status: "ready", text: "متصل" },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">آماده‌سازی جلسه</h3>
        <p className="text-white/60 text-sm">وضعیت سیستم و بیمار</p>
      </div>

      {/* Patient Info & Session Time */}
      <div className="space-y-4 mb-6">
        {/* Selected Patient Card */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <span className="text-white/70 text-sm">بیمار انتخاب‌شده</span>
          </div>
          {selectedPatient ? (
            <div>
              <p className="text-white font-bold text-lg mb-1">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
              <p className="text-white/60 text-sm">
                کد ملی: {selectedPatient.nationalCode}
              </p>
              {selectedPatient.nextSession && (
                <p className="text-cyan-400 text-sm mt-2">
                  جلسه بعدی:{" "}
                  {new Date(selectedPatient.nextSession.startTime).toLocaleString("fa-IR")}
                </p>
              )}
            </div>
          ) : (
            <p className="text-white/50 text-sm">
              هنوز بیماری انتخاب نشده است
            </p>
          )}
        </div>

        {/* Session Time Card */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-teal-400"></div>
            <span className="text-white/70 text-sm">زمان جلسه</span>
          </div>

          {selectedPatient?.nextSession ? (
            <p className="text-white font-semibold text-base">
              {new Date(selectedPatient.nextSession.startTime).toLocaleString("fa-IR")}
            </p>
          ) : (
            <p className="text-white/50 text-sm">
              جلسه‌ای ثبت نشده
            </p>
          )}
        </div>
      </div>

      {/* Equipment Status */}
      <div className="flex-1">
        <h4 className="text-sm text-white/70 mb-3">وضعیت تجهیزات</h4>
        <div className="space-y-2">
          {equipmentStatuses.map((item) => (
            <EquipmentStatusItem
              key={item.name}
              name={item.name}
              status={item.status}
              text={item.text}
            />
          ))}
        </div>
      </div>

      {/* System Ready Indicator */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">وضعیت کلی سیستم</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-green-400 font-semibold text-sm">آماده</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationPanel;
