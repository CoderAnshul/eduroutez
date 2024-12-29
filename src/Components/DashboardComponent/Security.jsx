import React, { useState } from 'react';

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for password update here
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);
    alert('Password updated successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Change Password</h2>
      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
            placeholder="Enter current password"
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block max-w-2/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-red-300 focus:border-red-600"
            placeholder="Enter  new password"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="max-w-2/5 mt-8 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Security;
