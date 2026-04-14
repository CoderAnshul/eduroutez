import React, { useState } from "react";
import { CalendarClock, X } from "lucide-react";

const ScheduleTestPopup = ({ open, onClose, onSchedule }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-slate-950/65 backdrop-blur-[2px] px-4 py-6 sm:px-6">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.35)] sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close schedule test popup"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#b82025]">
            <CalendarClock className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Schedule Guidance Test</h2>
          <p className="text-gray-600 leading-relaxed">
            Select a date and time to schedule your guidance test.
          </p>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>
        <button
          onClick={() => onSchedule(date, time)}
          className="w-full rounded-xl bg-[#b82025] py-3.5 font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-[#a11d21] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!date || !time}
        >
          Schedule Test
        </button>
      </div>
    </div>
  );
};

export default ScheduleTestPopup;
