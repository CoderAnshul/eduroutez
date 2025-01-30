import React, { useState ,useEffect} from "react";
import { useMutation, useQuery } from "react-query";
import axiosInstance from "../ApiFunctions/axios";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  

// Fetch the user data
const fetchUserData = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error("User ID not found in localStorage");
  }
  const response = await axiosInstance.get(`${VITE_BASE_URL}/student/${userId}`, {
    headers: {
      headers: {
        'Content-Type': 'application/json',
        
        'x-access-token': localStorage.getItem('accessToken'),
        'x-refresh-token': localStorage.getItem('refreshToken')
      }    }
  });
  return response.data.data;
};

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    designation: "",
    about: "",
    address: "",
    country: "",
    state: "",
    city: "",
  });

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch user data
  const { isLoading } = useQuery("userData", fetchUserData, {
    onSuccess: (data) => {
      setFormData({
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth && !isNaN(new Date(data.dateOfBirth))
        ? new Date(data.dateOfBirth).toISOString().split('T')[0]
        : null,        gender: data.gender,
        designation: data.designation,
        about: data.about,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,  
      });
    },
    onError: (error) => {
      alert("Error fetching user data: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


      // Fetch all states on component mount
      useEffect(() => {
        const fetchStates = async () => {
        try {
          const res = await axiosInstance.get(`${apiUrl}/states`);
          console.log(res.data);
          setStates(res.data?.data);
        } catch (err) {
          console.error("Failed to fetch states:", err);
        }
        };
        fetchStates();
      }, []);
      
      // Fetch cities when a state is selected
      useEffect(() => {
        const fetchCities = async () => {
          console.log('state',formData.state);
        if (formData.state) {
          try {
          const res = await axiosInstance.get(`${apiUrl}/cities-by-state/${formData.state}`);
          console.log('drftgyhujik',res.data.data);
          setCities(res.data?.data);
          } catch (err) {
          console.error("Failed to fetch cities:", err);
          }
        } else {
          setCities([]); // Reset cities when no state is selected
        }
        };
        fetchCities();
      }, [formData.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      const updatedForm = { ...formData, email: localStorage.getItem('email')?.replace(/^"|"$/g, '') };
      mutate({ userId, updatedForm });
      console.log(updatedForm);
    } catch (error) {
      alert("Some error occurred!");
    }
  };

  const { mutate } = useMutation({
    mutationFn: async ({ userId, updatedForm }) => {
      const endpoint = `${apiUrl}/student`; // PATCH request URL
      const response = await axiosInstance.post(endpoint, updatedForm, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')        }
      });
      console.log('cfgvhjk',response.data);
      return response.data;
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
    onError: () => {
      alert("Something went wrong");
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-2 md:p-2 rounded-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* About Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About Information</h2>
              <div className="mb-4">
                <label className="block font-medium mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="UI/UX Designer | Product Designer | Mobile App Expert"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="About Myself"
                  className="w-full border rounded px-4 py-2"
                  rows="4"
                />
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
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  className="w-full border rounded px-4 py-2"
                />


                  {/* Address Section */}
  <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  name="state"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  name="city"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!formData.state}
                >
                  <option value="">Select a City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
              </div>




              <div>
                <label className="block font-medium mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Select Country...</option>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded shadow-md hover:bg-red-600 transition"
            >
              Save & Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
