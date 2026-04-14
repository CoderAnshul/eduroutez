import React from "react";
import { ShieldCheck, X } from "lucide-react";

const GuidanceTestPopup = ({ open, onClose, onPay, onScheduleLater }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-slate-950/65 backdrop-blur-[2px] px-4 py-6 sm:px-6">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.35)] sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close counsellor guidance popup"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#b82025]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">Become a Verified Counsellor</h2>
          <p className="text-gray-600 leading-relaxed">
            To complete your registration and become a verified counsellor, you must pay and give the guidance test. You can do it now or schedule for later. Only verified counsellors can do counselling.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onPay}
            className="w-full rounded-xl bg-[#b82025] py-3.5 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-[#a11d21]"
          >
            Pay & Give Test
          </button>
          <button
            onClick={onScheduleLater}
            className="w-full rounded-xl border border-[#b82025] py-3.5 font-semibold text-[#b82025] transition hover:bg-red-50"
          >
            Schedule Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidanceTestPopup;
