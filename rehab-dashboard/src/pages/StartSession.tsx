import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Play, Square, ArrowRight, AlertCircle } from "lucide-react";

const StartSession = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [startingSession, setStartingSession] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const startCamera = async () => {
    try {
      setLoadingCamera(true);
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (err) {
      console.error(err);
      setCameraError("دسترسی به وب‌کم ممکن نیست. لطفاً مجوز Camera را بررسی کنید.");
      setCameraOn(false);
    } finally {
      setLoadingCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const handleStartSession = async () => {
    try {
      setStartingSession(true);
      setSessionError(null);
      if (!window.electronAPI?.runBoatExe) {
        throw new Error("Electron bridge is not available.");
      }

      const result = await window.electronAPI.runBoatExe();
      if (!result?.success) {
        throw new Error("boat.exe did not report success.");
      }
      setSessionStarted(true);
    } catch (err) {
      console.error(err);
      setSessionStarted(false);
      const message = err instanceof Error ? err.message : "Unknown error";
      setSessionError(`اجرای boat.exe با خطا مواجه شد: ${message}`);
    } finally {
      setStartingSession(false);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            شروع جلسه توانبخشی
          </h1>
          <p className="text-cyan-100/80 mt-2">
            تصویر زنده بیمار و کنترل وضعیت جلسه
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

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Webcam Panel (Large) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-cyan-300" />
            <h2 className="text-white font-semibold text-lg">تصویر بیمار (وب‌کم)</h2>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {!cameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-100/80">
                <Camera className="w-12 h-12 mb-3 opacity-70" />
                <p>وب‌کم فعال نیست</p>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="mt-4 p-3 rounded-xl border border-red-400/30 bg-red-500/10 text-red-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {sessionError && (
            <div className="mt-4 p-3 rounded-xl border border-red-400/30 bg-red-500/10 text-red-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <span>{sessionError}</span>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="text-white text-lg font-semibold">کنترل جلسه</h2>

          <div className="space-y-2 text-cyan-100/80 text-sm">
            <p>وضعیت دوربین: {cameraOn ? "✅ فعال" : "❌ غیرفعال"}</p>
            <p>وضعیت جلسه: {sessionStarted ? "🟢 شروع شده" : "🟡 شروع نشده"}</p>
          </div>

          <div className="pt-3 space-y-3">
            {!cameraOn ? (
              <button
                onClick={startCamera}
                disabled={loadingCamera}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {loadingCamera ? "در حال فعال‌سازی..." : "فعال‌سازی وب‌کم"}
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <Square className="w-5 h-5" />
                توقف وب‌کم
              </button>
            )}

            <button
              onClick={handleStartSession}
              disabled={startingSession}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {startingSession ? "در حال اجرای جلسه..." : "Start Session"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartSession;
