import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { usePatient } from "../contexts/PatientContext";
import { patientsApi } from "../api/patients";
import type { PatientWithNextSession } from "../types/api";

const PatientSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedPatient } = usePatient();
  const [patients, setPatients] = useState<PatientWithNextSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadPatients();
  }, []);

  const handleSelectPatient = (patient: PatientWithNextSession) => {
    setSelectedPatient(patient);
    navigate("/");
  };

  // Filter and sort patients
  const filteredPatients = patients
    .filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        p.firstName.toLowerCase().includes(term) ||
        p.lastName.toLowerCase().includes(term) ||
        p.nationalCode.includes(term)
      );
    })
    .sort((a, b) => {
      // Sort by nearest session first
      if (a.nextSession && b.nextSession) {
        return (
          new Date(a.nextSession.startTime).getTime() -
          new Date(b.nextSession.startTime).getTime()
        );
      }
      if (a.nextSession) return -1;
      if (b.nextSession) return 1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              انتخاب بیمار
            </h1>
            <p className="text-white/60">
              بیمار مورد نظر را برای شروع جلسه انتخاب کنید
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، نام خانوادگی یا کد ملی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Patients List */}
        <div className="glass-card rounded-2xl divide-y divide-white/10">
          {loading && (
            <div className="p-6 text-center text-white/60">
              در حال بارگذاری...
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && filteredPatients.length === 0 && (
            <div className="p-6 text-center text-white/60">
              بیماری پیدا نشد
            </div>
          )}

          {!loading &&
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className="p-4 hover:bg-white/5 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-500/20 p-3 rounded-xl">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-white/50 text-sm">
                      کد ملی: {patient.nationalCode}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  {patient.nextSession ? (
                    <div className="flex items-center gap-2 text-cyan-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(
                        patient.nextSession.startTime
                      ).toLocaleString("fa-IR")}
                    </div>
                  ) : (
                    <span className="text-white/40 text-sm">
                      جلسه‌ای ندارد
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PatientSelection;
