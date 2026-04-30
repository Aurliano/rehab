import { useState} from "react";
import type {  FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { patientsApi } from "../api/patients";

interface PatientFormData {
  firstName: string;
  lastName: string;
  nationalCode: string;
  age: string;
  gender: string;
  phone: string;
  injuryType: string;
  affectedSide: string;
  notes: string;
}

export default function AddPatient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    nationalCode: "",
    age: "",
    gender: "",
    phone: "",
    injuryType: "",
    affectedSide: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<PatientFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientFormData> = {};

    // نام
    if (!formData.firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    }

    // نام خانوادگی
    if (!formData.lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    }

    // کد ملی - باید ۱۰ رقم باشد
    if (!formData.nationalCode.trim()) {
      newErrors.nationalCode = "کد ملی الزامی است";
    } else if (!/^\d{10}$/.test(formData.nationalCode)) {
      newErrors.nationalCode = "کد ملی باید ۱۰ رقم باشد";
    }

    // سن
    if (!formData.age.trim()) {
      newErrors.age = "سن الزامی است";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "سن باید عدد مثبت باشد";
    }

    // جنسیت
    if (!formData.gender) {
      newErrors.gender = "جنسیت الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await patientsApi.create({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nationalCode: formData.nationalCode.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone.trim() || undefined,
        injuryType: formData.injuryType.trim() || undefined,
        affectedSide: formData.affectedSide || undefined,
        notes: formData.notes.trim() || undefined,
      });

      // بازگشت به صفحه انتخاب بیمار
      navigate("/patients");
    } catch (err) {
      setError("خطا در ثبت بیمار. لطفاً دوباره تلاش کنید.");
      console.error("Error creating patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // پاک کردن خطای فیلد هنگام تغییر
    if (errors[name as keyof PatientFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← بازگشت
          </button>
          <h1 className="text-3xl font-bold text-gray-800">افزودن بیمار جدید</h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          {/* نام و نام خانوادگی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">نام *</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">نام خانوادگی *</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* کد ملی و سن */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">کد ملی *</label>
              <input
                name="nationalCode"
                value={formData.nationalCode}
                onChange={handleChange}
                maxLength={10}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.nationalCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nationalCode}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">سن *</label>
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age}
                </p>
              )}
            </div>
          </div>

          {/* جنسیت و سمت آسیب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">جنسیت *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">انتخاب کنید</option>
                <option value="Male">مرد</option>
                <option value="Female">زن</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">
                سمت آسیب‌دیده
              </label>
              <select
                name="affectedSide"
                value={formData.affectedSide}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">انتخاب کنید</option>
                <option value="Left">چپ</option>
                <option value="Right">راست</option>
                <option value="Both">هر دو</option>
              </select>
            </div>
          </div>

          {/* تلفن و نوع آسیب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">تلفن</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">نوع آسیب</label>
              <input
                name="injuryType"
                value={formData.injuryType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* توضیحات */}
          <div>
            <label className="block mb-2 font-medium">یادداشت</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* دکمه‌ها */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "در حال ثبت..." : "ثبت بیمار"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
