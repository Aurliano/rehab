import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { patientsApi } from "../api/patients";

type PatientForm = {
  firstName: string;
  lastName: string;
  nationalCode: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  injuryType?: string;
  affectedSide?: string;
  injuryDate: string;
};

const genderOptions = ["Male", "Female", "Other"];
const injuryOptions = [
  "Orthopedic",
  "Neurological",
  "SpinalCordInjury",
  "Other",
];
const sideOptions = ["Left", "Right", "Both"];

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<any>(null);
  const [form, setForm] = useState<PatientForm | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    if (!id || isNaN(Number(id))) {
      setError("شناسه بیمار نامعتبر است");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await patientsApi.getById(Number(id));
      setPatient(data);
      setForm({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        nationalCode: data.nationalCode ?? "",
        dateOfBirth: (data.dateOfBirth ?? "").split("T")[0],
        gender: data.gender ?? "Male",
        phoneNumber: data.phoneNumber ?? "",
        injuryType: data.injuryType ?? "Orthopedic",
        affectedSide: data.affectedSide ?? "Left",
        injuryDate: (data.injuryDate ?? "").split("T")[0],
      });
    } catch (err) {
      console.error("❌ خطا:", err);
      setError("خطا در بارگذاری اطلاعات بیمار");
    } finally {
      setLoading(false);
    }
  };

  const age = useMemo(() => {
    if (!patient?.dateOfBirth) return "-";
    const dob = new Date(patient.dateOfBirth);
    const diff = Date.now() - dob.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }, [patient]);

  const faDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("fa-IR") : "-";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form || !patient?.id) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = {
        id: patient.id,
        ...form,
        dateOfBirth: form.dateOfBirth,
        injuryDate: form.injuryDate,
      };

      const updated = await patientsApi.update(patient.id, payload);
      setPatient(updated);
      await loadPatient();
      setEditMode(false);
      setSuccess("اطلاعات بیمار با موفقیت ذخیره شد.");
    } catch (err) {
      console.error(err);
      setError("خطا در ذخیره اطلاعات بیمار");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!patient?.id) return;
    if (!confirm("آیا از حذف بیمار مطمئن هستید؟ این عمل قابل بازگشت نیست.")) return;

    try {
      setDeleting(true);
      await patientsApi.remove(patient.id);
      navigate("/patient-selection");
    } catch (err) {
      console.error(err);
      setError("خطا در حذف بیمار");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error && !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-400 text-xl">{error}</div>
        <button
          onClick={() => navigate("/patient-selection")}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white"
        >
          بازگشت به لیست بیماران
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {patient?.firstName} {patient?.lastName}
          </h1>
          <p className="text-cyan-100/80 mt-2">
            کد ملی: {patient?.nationalCode ?? "-"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={() => setEditMode((p) => !p)}
          >
            {editMode ? "لغو ویرایش" : "ویرایش اطلاعات"}
          </button>
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
      </div>

      {error && (
        <div className="glass-card p-4 border border-red-400/30 text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="glass-card p-4 border border-emerald-400/30 text-emerald-300">
          {success}
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">اطلاعات شخصی</h2>

          {!editMode ? (
            <div className="space-y-3 text-cyan-100/80">
              <div>سن: {age}</div>
              <div>تاریخ تولد: {faDate(patient?.dateOfBirth)}</div>
              <div>جنسیت: {patient?.gender ?? "-"}</div>
              <div>شماره تماس: {patient?.phoneNumber ?? "-"}</div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                name="firstName"
                value={form?.firstName ?? ""}
                onChange={handleChange}
                className="input-style"
                placeholder="نام"
              />
              <input
                name="lastName"
                value={form?.lastName ?? ""}
                onChange={handleChange}
                className="input-style"
                placeholder="نام خانوادگی"
              />
              <input
                name="nationalCode"
                value={form?.nationalCode ?? ""}
                onChange={handleChange}
                className="input-style"
                placeholder="کد ملی"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={form?.dateOfBirth ?? ""}
                onChange={handleChange}
                className="input-style"
              />
              <select
                name="gender"
                value={form?.gender ?? "Male"}
                onChange={handleChange}
                className="input-style"
              >
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <input
                name="phoneNumber"
                value={form?.phoneNumber ?? ""}
                onChange={handleChange}
                className="input-style"
                placeholder="شماره تماس"
              />
            </div>
          )}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">اطلاعات بالینی</h2>

          {!editMode ? (
            <div className="space-y-3 text-cyan-100/80">
              <div>نوع آسیب: {patient?.injuryType ?? "-"}</div>
              <div>سمت درگیر: {patient?.affectedSide ?? "-"}</div>
              <div>تاریخ آسیب: {faDate(patient?.injuryDate)}</div>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                name="injuryType"
                value={form?.injuryType ?? "Orthopedic"}
                onChange={handleChange}
                className="input-style"
              >
                {injuryOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <select
                name="affectedSide"
                value={form?.affectedSide ?? "Left"}
                onChange={handleChange}
                className="input-style"
              >
                {sideOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="injuryDate"
                value={form?.injuryDate ?? ""}
                onChange={handleChange}
                className="input-style"
              />
            </div>
          )}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-xl font-semibold">وضعیت جلسه بعدی</h2>
          {patient?.nextSession ? (
            <div className="space-y-2 text-cyan-100/80">
              <div>شروع: {faDate(patient.nextSession.startTime)}</div>
              <div>وضعیت: {patient.nextSession.status}</div>
            </div>
          ) : (
            <div className="text-cyan-200/60">
              جلسه‌ای برنامه‌ریزی نشده است
            </div>
          )}

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!editMode || saving}
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>

            <button
              className="btn-secondary border border-red-500/40 text-red-300 hover:text-red-200"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "در حال حذف..." : "حذف بیمار"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
