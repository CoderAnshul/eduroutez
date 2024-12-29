import React, { useState } from 'react';

const ScheduleCallPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed p-4 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Schedule Call</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Schedule Call Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Time Slots <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['15:39', '16:09', '17:09', '17:39', '18:09', '18:39', '19:09', '19:39', '20:09', '20:39', '21:09'].map(
                (time) => (
                  <label key={time} className="flex items-center">
                    <input
                      type="radio"
                      name="timeSlot"
                      className="mr-2"
                      value={time}
                    />
                    {time}
                  </label>
                )
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleCallPopup;