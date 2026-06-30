import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, User, FileText, Play, ArrowRight } from "lucide-react";
import { usePatient } from "../contexts/PatientContext";
import { patientsApi } from "../api/patients";
import type { PatientWithNextSession } from "../types/api";

export default function PatientSelection() {
  const navigate = useNavigate();
  const { setSelectedPatient } = usePatient();

  const [patients, setPatients] = useState<PatientWithNextSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getAllWithNextSession();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError("خطا در بارگذاری لیست بیماران");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 تابع برای شروع جلسه درمانی
  const handleStartSession = (patient: PatientWithNextSession) => {
    setSelectedPatient(patient);
    navigate("/"); // به صفحه اصلی برمی‌گردیم
  };

  // 🔴 تابع برای مشاهده پرونده پزشکی
const handleViewProfile = (patientId?: number) => {
  if (!patientId) return;
  navigate(`/patients/${patientId}/profile`);
};


  const filteredPatients = patients
    .filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nationalCode.includes(searchTerm)
    )
    .sort((a, b) => {
      if (a.nextSession && !b.nextSession) return -1;
      if (!a.nextSession && b.nextSession) return 1;
      if (a.nextSession && b.nextSession) {
        return (
          new Date(a.nextSession.startTime).getTime() -
          new Date(b.nextSession.startTime).getTime()
        );
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061622] via-[#0a2540] to-[#061622] flex items-center justify-center">
        <div className="text-cyan-300 text-2xl">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">انتخاب بیمار</h1>
            <p className="text-cyan-100/80 mt-2">
              بیمار مورد نظر را برای مشاهده پرونده یا شروع جلسه انتخاب کنید
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="
              inline-flex w-auto flex-none items-center gap-2
              px-4 py-2 rounded-xl
              bg-white/10 hover:bg-white/20
              border border-white/20
              text-white transition-all
            "
          >
            <ArrowRight className="w-5 h-5" />
            بازگشت
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 w-6 h-6" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، نام خانوادگی یا کد ملی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-14 pl-6 py-4 bg-white/5 backdrop-blur-xl border border-cyan-400/30 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient.patientId}
              className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
            >
              {/* Patient Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    کد ملی: {patient.nationalCode}
                  </p>
                </div>
              </div>

              {/* Next Session Info */}
              {patient.nextSession ? (
                <div className="mb-4 p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-xl">
                  <div className="flex items-center gap-2 text-cyan-300 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">جلسه بعدی:</span>
                  </div>
                  <p className="text-white text-sm">
                    {new Date(patient.nextSession.startTime).toLocaleDateString(
                      "fa-IR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                  <p className="text-slate-400 text-sm text-center">
                    جلسه‌ای برنامه‌ریزی نشده
                  </p>
                </div>
              )}

              {/* 🔴 دو دکمه جداگانه */}
              <div className="flex gap-3">
                {/* دکمه مشاهده پرونده */}
                <button
                  onClick={() => handleViewProfile(patient.patientId)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 rounded-xl text-blue-300 hover:text-blue-200 transition-all duration-300"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">مشاهده پرونده</span>
                </button>

                {/* دکمه شروع جلسه */}
                <button
                  onClick={() => handleStartSession(patient)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/30"
                >
                  <Play className="w-5 h-5" />
                  <span>شروع جلسه</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPatients.length === 0 && !loading && (
          <div className="text-center py-20">
            <User className="w-20 h-20 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-xl">
              {searchTerm
                ? "بیماری یافت نشد"
                : "هیچ بیماری ثبت نشده است"}
            </p>
          </div>
        )}
    </div>
  );
}

