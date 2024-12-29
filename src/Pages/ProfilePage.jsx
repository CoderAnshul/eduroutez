import React from "react";

const ProfilePage = () => {
  return (
    <div className="p-2 md:p-2  rounded-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <form>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Anshul Sharma"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="7999967578"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Date Of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-4 py-2"
                  defaultValue="2024-12-29"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select className="w-full border rounded px-4 py-2">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </form>
          </div>

          {/* About Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About Information</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Designation</label>
              <input
                type="text"
                placeholder="UI/UX Designer | Product Designer | Mobile App Expert"
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">About</label>
              <textarea
                placeholder="About My Self"
                className="w-full border rounded px-4 py-2"
                rows="4"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Profile Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded w-full h-32 flex items-center justify-center">
                <div className="text-gray-500">Upload Image</div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                NB: Profile size will 100px x 100px and not more than 1MB.
              </p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Address</label>
              <input
                type="text"
                placeholder="Enter Your Address"
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Country</label>
              <select className="w-full border rounded px-4 py-2">
                <option>Select Country...</option>
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded shadow-md hover:bg-red-600 transition">
            Save & Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
