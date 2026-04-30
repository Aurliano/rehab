// src/pages/Schedule.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Plus, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { sessionsApi } from "../api/sessions";
import { patientsApi } from "../api/patients";
import type { Session, Patient } from "../types/api";

interface SessionWithPatient extends Session {
  patient?: Patient;
}

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionWithPatient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  // گرفتن اول هفته (شنبه)
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 6 ? 0 : day + 1; // شنبه = 0
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // تولید آرایه روزهای هفته
  function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  const weekDays = getWeekDays(currentWeekStart);
  const persianDayNames = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

  useEffect(() => {
    loadData();
  }, [currentWeekStart]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [sessionsData, patientsData] = await Promise.all([
        sessionsApi.getAll(),
        patientsApi.getAll(),
      ]);

      // ترکیب اطلاعات بیمار با جلسه
      const sessionsWithPatients = sessionsData.map((session) => ({
        ...session,
        patient: patientsData.find((p) => p.id === session.patientId),
      }));

      setSessions(sessionsWithPatients);
      setPatients(patientsData);
    } catch (err) {
      setError("خطا در بارگذاری اطلاعات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // فیلتر جلسات روز انتخاب شده
  function getSessionsForDay(day: Date): SessionWithPatient[] {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return (
        sessionDate.getFullYear() === day.getFullYear() &&
        sessionDate.getMonth() === day.getMonth() &&
        sessionDate.getDate() === day.getDate()
      );
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
  }

  function goToPreviousWeek() {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  }

  function goToNextWeek() {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  }

  function goToToday() {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
    setSelectedDay(today);
  }

  function isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  const selectedDaySessions = getSessionsForDay(selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">برنامه جلسات</h1>
              <p className="text-purple-200">مدیریت و زمان‌بندی جلسات توانبخشی</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/add-session")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>جلسه جدید</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="text-white mt-4">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
            <p className="text-red-200">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* تقویم هفتگی */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {/* کنترل‌های ناوبری */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousWeek}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="text-sm text-purple-300 hover:text-purple-200 mt-1"
                  >
                    برو به امروز
                  </button>
                </div>
                <button
                  onClick={goToNextWeek}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* روزهای هفته */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => {
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDay);
                  const daySessions = getSessionsForDay(day);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(day)}
                      className={`
                        p-4 rounded-xl transition-all
                        ${isSelected
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-105"
                          : "bg-white/5 hover:bg-white/10"
                        }
                        ${isToday && !isSelected ? "ring-2 ring-purple-400" : ""}
                      `}
                    >
                      <div className="text-center">
                        <p className={`text-xs ${isSelected ? "text-white" : "text-purple-300"} mb-1`}>
                          {persianDayNames[index]}
                        </p>
                        <p className={`text-2xl font-bold ${isSelected ? "text-white" : "text-white"}`}>
                          {day.getDate()}
                        </p>
                        {daySessions.length > 0 && (
                          <div className="mt-2 flex justify-center gap-1">
                            {daySessions.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? "bg-white" : "bg-purple-400"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* لیست جلسات روز انتخاب شده */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">
                  {persianDayNames[selectedDay.getDay() === 6 ? 0 : selectedDay.getDay() + 1]}
                </h3>
              </div>

              {selectedDaySessions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">جلسه‌ای برای این روز ثبت نشده</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => navigate(`/session/${session.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-medium">
                            {formatTime(session.startTime)}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === "Completed"
                              ? "bg-green-500/20 text-green-300"
                              : session.status === "InProgress"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {session.status === "Completed"
                            ? "تکمیل شده"
                            : session.status === "InProgress"
                            ? "در حال انجام"
                            : "برنامه‌ریزی شده"}
                        </span>
                      </div>

                      {session.patient && (
                        <div className="flex items-center gap-2 text-white/80">
                          <User className="w-4 h-4 text-purple-400" />
                          <span>
                            {session.patient.firstName} {session.patient.lastName}
                          </span>
                        </div>
                      )}

                      {session.notes && (
                        <p className="text-sm text-white/60 mt-2 line-clamp-2">{session.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Empty State */}
            {!loading && !error && selectedDaySessions.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">هیچ جلسه‌ای برای این روز ثبت نشده است</p>
                <button
                  onClick={() => navigate("/add-session")}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  افزودن جلسه جدید
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;

