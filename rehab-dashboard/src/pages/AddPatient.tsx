import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { patientsApi } from "../api/patients";

interface PatientFormData {
  firstName: string;
  lastName: string;
  nationalCode: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | "";
  phoneNumber: string;
  injuryType:
    | "Stroke"
    | "SpinalCordInjury"
    | "TraumaticBrainInjury"
    | "Orthopedic"
    | "Neurological"
    | "Other"
    | "";
  affectedSide: "Left" | "Right" | "Both" | "";
  injuryDate: string;
}
type FormErrors = Partial<Record<keyof PatientFormData, string>>;

// تبدیل تاریخ شمسی به میلادی
function jalaliToGregorian(jy: number, jm: number, jd: number): string {
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;

  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy += 400 * Math.floor(days / 146097);
  days %= 146097;

  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
    else leap = false;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days >= 366) {
    leap = false;
    days--;
    gy += Math.floor(days / 365);
    days %= 365;
  }

  let gm = 0;
  for (let i = 0; g_days_in_month[i] + (i === 1 && leap ? 1 : 0) <= days; i++) {
    gm++;
    days -= g_days_in_month[i] + (i === 1 && leap ? 1 : 0);
  }

  const gd = days + 1;
  gm += 1;

  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
}

function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-green-400/50 animate-fade-in z-50 flex items-center gap-3">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-semibold">{message}</span>
    </div>
  );
}

export default function AddPatient() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [birthDateJalali, setBirthDateJalali] = useState({ year: "", month: "", day: "" });
  const [injuryDateJalali, setInjuryDateJalali] = useState({ year: "", month: "", day: "" });

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    nationalCode: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    injuryType: "",
    affectedSide: "",
    injuryDate: "",
  });

const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "نام الزامی است";
    else if (formData.firstName.length > 50) newErrors.firstName = "نام نباید بیشتر از 50 کاراکتر باشد";

    if (!formData.lastName.trim()) newErrors.lastName = "نام خانوادگی الزامی است";
    else if (formData.lastName.length > 50) newErrors.lastName = "نام خانوادگی نباید بیشتر از 50 کاراکتر باشد";

    if (!formData.nationalCode.trim()) {
      newErrors.nationalCode = "کد ملی الزامی است";
    } else if (!/^\d{10}$/.test(formData.nationalCode)) {
      newErrors.nationalCode = "کد ملی باید ۱۰ رقم باشد";
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "تاریخ تولد الزامی است";
    if (!formData.gender) newErrors.gender = "جنسیت الزامی است";

    if (!formData.phoneNumber.trim()) {
      // شماره تماس اختیاری است، اگر می‌خوای اجباری شود این خط را حذف کن
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "شماره تماس معتبر نیست";
    }

    if (!formData.injuryType) newErrors.injuryType = "نوع آسیب الزامی است";
    if (!formData.affectedSide) newErrors.affectedSide = "سمت آسیب الزامی است";
    if (!formData.injuryDate) newErrors.injuryDate = "تاریخ آسیب الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await patientsApi.create(formData);
      setShowSuccess(true);
      setTimeout(() => navigate("/patients"), 1500);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || "ثبت بیمار انجام نشد";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateBirthDate = (field: "year" | "month" | "day", value: string) => {
    if (field === "month") {
      const month = Number(value);
      if (month < 1 || month > 12) return;
    }

    if (field === "day") {
      const day = Number(value);
      if (day < 1 || day > 31) return;
    }

    const updated = { ...birthDateJalali, [field]: value };
    setBirthDateJalali(updated);

    if (updated.year.length === 4 && updated.month && updated.day) {
      const gregorian = jalaliToGregorian(Number(updated.year), Number(updated.month), Number(updated.day));
      setFormData({ ...formData, dateOfBirth: gregorian });
    }
  };

  const updateInjuryDate = (field: "year" | "month" | "day", value: string) => {
    if (field === "month") {
      const month = Number(value);
      if (month < 1 || month > 12) return;
    }

    if (field === "day") {
      const day = Number(value);
      if (day < 1 || day > 31) return;
    }

    const updated = { ...injuryDateJalali, [field]: value };
    setInjuryDateJalali(updated);

    if (updated.year.length === 4 && updated.month && updated.day) {
      const gregorian = jalaliToGregorian(Number(updated.year), Number(updated.month), Number(updated.day));
      setFormData({ ...formData, injuryDate: gregorian });
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {showSuccess && <SuccessAlert message="بیمار با موفقیت ثبت شد" />}

        {/* Header */}
        <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">افزودن بیمار جدید</h1>
            <p className="text-cyan-100/80 mt-2">اطلاعات بیمار را وارد کنید</p>
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

        <div className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-8 shadow-2xl">
          {apiError && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-6">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* نام */}
            <div>
              <input
                type="text"
                placeholder="نام"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`input-style ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && <p className="text-red-400 text-sm mt-2">{errors.firstName}</p>}
            </div>

            {/* نام خانوادگی */}
            <div>
              <input
                type="text"
                placeholder="نام خانوادگی"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`input-style ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && <p className="text-red-400 text-sm mt-2">{errors.lastName}</p>}
            </div>

            {/* کد ملی */}
            <div>
              <input
                type="text"
                placeholder="کد ملی"
                value={formData.nationalCode}
                onChange={(e) => setFormData({ ...formData, nationalCode: e.target.value })}
                className={`input-style ${errors.nationalCode ? "border-red-500" : ""}`}
              />
              {errors.nationalCode && <p className="text-red-400 text-sm mt-2">{errors.nationalCode}</p>}
            </div>

            {/* جنسیت */}
            <div>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as PatientFormData["gender"] })}
                className={`input-style ${errors.gender ? "border-red-500" : ""}`}
              >
                <option value="">انتخاب جنسیت</option>
                <option value="Male">مرد</option>
                <option value="Female">زن</option>
                <option value="Other">سایر</option>
              </select>
              {errors.gender && <p className="text-red-400 text-sm mt-2">{errors.gender}</p>}
            </div>

            {/* تاریخ تولد */}
            <div>
              <label className="text-slate-300 mb-3 block">تاریخ تولد</label>
              <div className="flex gap-3">
                <input type="number" min="1300" max="1500" placeholder="سال" value={birthDateJalali.year}
                  onChange={(e) => updateBirthDate("year", e.target.value)} className="input-style text-center" />
                <input type="number" min="1" max="12" placeholder="ماه" value={birthDateJalali.month}
                  onChange={(e) => updateBirthDate("month", e.target.value)} className="input-style text-center" />
                <input type="number" min="1" max="31" placeholder="روز" value={birthDateJalali.day}
                  onChange={(e) => updateBirthDate("day", e.target.value)} className="input-style text-center" />
              </div>
              {errors.dateOfBirth && <p className="text-red-400 text-sm mt-2">{errors.dateOfBirth}</p>}
            </div>

            {/* تلفن */}
            <div>
              <input
                type="text"
                placeholder="شماره تماس"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`input-style ${errors.phoneNumber ? "border-red-500" : ""}`}
              />
              {errors.phoneNumber && <p className="text-red-400 text-sm mt-2">{errors.phoneNumber}</p>}
            </div>

            {/* نوع آسیب */}
            <div>
              <select
                value={formData.injuryType}
                onChange={(e) => setFormData({ ...formData, injuryType: e.target.value as PatientFormData["injuryType"] })}
                className={`input-style ${errors.injuryType ? "border-red-500" : ""}`}
              >
                <option value="">نوع آسیب</option>
                <option value="Stroke">سکته مغزی</option>
                <option value="SpinalCordInjury">آسیب نخاعی</option>
                <option value="TraumaticBrainInjury">آسیب مغزی تروماتیک</option>
                <option value="Orthopedic">ارتوپدی</option>
                <option value="Neurological">نورولوژیک</option>
                <option value="Other">سایر</option>
              </select>
              {errors.injuryType && <p className="text-red-400 text-sm mt-2">{errors.injuryType}</p>}
            </div>

            {/* سمت آسیب */}
            <div>
              <select
                value={formData.affectedSide}
                onChange={(e) => setFormData({ ...formData, affectedSide: e.target.value as PatientFormData["affectedSide"] })}
                className={`input-style ${errors.affectedSide ? "border-red-500" : ""}`}
              >
                <option value="">سمت آسیب</option>
                <option value="Left">چپ</option>
                <option value="Right">راست</option>
                <option value="Both">هر دو</option>
              </select>
              {errors.affectedSide && <p className="text-red-400 text-sm mt-2">{errors.affectedSide}</p>}
            </div>

            {/* تاریخ آسیب */}
            <div>
              <label className="text-slate-300 mb-3 block">تاریخ آسیب</label>
              <div className="flex gap-3">
                <input type="number" min="1300" max="1500" placeholder="سال" value={injuryDateJalali.year}
                  onChange={(e) => updateInjuryDate("year", e.target.value)} className="input-style text-center" />
                <input type="number" min="1" max="12" placeholder="ماه" value={injuryDateJalali.month}
                  onChange={(e) => updateInjuryDate("month", e.target.value)} className="input-style text-center" />
                <input type="number" min="1" max="31" placeholder="روز" value={injuryDateJalali.day}
                  onChange={(e) => updateInjuryDate("day", e.target.value)} className="input-style text-center" />
              </div>
              {errors.injuryDate && <p className="text-red-400 text-sm mt-2">{errors.injuryDate}</p>}
            </div>

            {/* دکمه ثبت */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 mx-auto w-full md:w-72 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#021728] font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت بیمار"}
            </button>
          </form>
        </div>
    </div>
  );
}
