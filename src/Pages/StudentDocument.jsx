import React, { useState } from 'react';

const StudentDocument = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);

    if (!showModal) {
      // Disable scrolling when modal is open
      document.body.classList.add('overflow-hidden');
    } else {
      // Enable scrolling when modal is closed
      document.body.classList.remove('overflow-hidden');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Main Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Documents</h2>
        <button
          onClick={toggleModal}
          className="px-4 py-2 border-2 border-red-600 text-red-600 font-medium text-sm rounded-md hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50 flex items-center gap-2"
        >
          <i className="fa fa-plus"></i> Add New
        </button>
      </div>

      {/* Document Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <i className="fa fa-folder text-gray-500"></i>
          <span className="font-medium text-gray-700">Educations</span>
        </div>
        <hr className="border-t border-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card</label>
          <input
            type="file"
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
          <input
            type="file"
            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <button className="mt-6 px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50">
        Upload Documents
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Education</h2>
              <button
                onClick={toggleModal}
                className="text-red-500 hover:text-red-600 text-xl"
              >
                &times;
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Institute <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Daffodil International University"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Program <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: Computer Science And Engineering"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Degree <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: Bachelor"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Certificate Image</label>
                <input
                  type="file"
                  className="w-full text-gray-700 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDocument;
