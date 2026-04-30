import React from "react";
import { Clock, User, Shield } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 px-8 py-3 flex items-center justify-between text-sm text-white/60">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <User size={14} />
        <div className="text-left">
          <div className="text-white text-xs">دکتر رضایی</div>
          <div className="text-xs text-white/40">پزشک توانبخشی</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={14} />
        <span>۰۹:۱۵</span>
      </div>
    </div>
    <span className="text-white/30 text-xs">تکنولوژی‌ای برای توانبخشی بهتر</span>
    <div className="flex items-center gap-2">
      <span className="text-green-400">● اتصال ایمن</span>
      <Shield size={14} className="text-green-400" />
    </div>
  </footer>
);

export default Footer;
