import React, { useState } from "react";

const ScheduleTestPopup = ({ open, onClose, onSchedule }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Schedule Guidance Test</h2>
          <p className="text-gray-600">
            Select a date and time to schedule your guidance test.
          </p>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          onClick={() => onSchedule(date, time)}
          className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800"
          disabled={!date || !time}
        >
          Schedule Test
        </button>
      </div>
    </div>
  );
};

export default ScheduleTestPopup;
