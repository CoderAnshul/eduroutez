import React, { useState, useEffect } from "react";
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
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken'),
      'x-refresh-token': localStorage.getItem('refreshToken')
    }
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
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Add these flags to track if location data has been fetched
  const [statesFetched, setStatesFetched] = useState(false);
  const [citiesFetched, setCitiesFetched] = useState(false);

  // Fetch user data
  const { isLoading } = useQuery("userData", fetchUserData, {
    onSuccess: (data) => {
      setFormData({
        name: data.name,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth && !isNaN(new Date(data.dateOfBirth))
          ? new Date(data.dateOfBirth).toISOString().split('T')[0]
          : null,
        gender: data.gender,
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
    
    // Handle special cases for location fields
    if (name === "country") {
      setFormData({ 
        ...formData, 
        [name]: value, 
        state: "", // Reset dependent fields
        city: "" 
      });
      setStatesFetched(false); // Reset the fetched flag
      setCitiesFetched(false);
    } else if (name === "state") {
      setFormData({ 
        ...formData, 
        [name]: value, 
        city: "" // Reset city when state changes
      });
      setCitiesFetched(false); // Reset the fetched flag
    } else {
      // Normal field update
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get(`${apiUrl}/countries`);
        setCountries(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, [apiUrl]);

  // Fetch states when a country is selected and not already fetched
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.country && !statesFetched) {
        try {
          // Use the selected country's iso2 as countryCode
          const selectedCountry = countries.find(country => country.id.toString() === formData.country);
          if (selectedCountry) {
            // Send countryCode in the request body
            const res = await axiosInstance.post(`${apiUrl}/states-by-country`, {
              countryCode: selectedCountry.iso2
            });
            setStates(res.data?.data || []);
            setStatesFetched(true); // Mark as fetched
          }
        } catch (err) {
          console.error("Failed to fetch states:", err);
        }
      }
    };
    fetchStates();
  }, [formData.country, countries, apiUrl, statesFetched]);

  // Fetch cities when a state is selected and not already fetched
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.state && formData.country && !citiesFetched) {
        try {
          // Get the country iso2 code for API request
          const selectedCountry = countries.find(country => country.id.toString() === formData.country);
          const selectedState = states.find(state => state.id.toString() === formData.state);
          if (selectedCountry && selectedState) {
            // Send countryCode and stateCode in the request body
            const res = await axiosInstance.post(`${apiUrl}/cities-by-state`, {
              countryCode: selectedCountry.iso2,
              stateCode: selectedState.iso2
            });
            setCities(res.data?.data || []);
            setCitiesFetched(true); // Mark as fetched
          }
        } catch (err) {
          console.error("Failed to fetch cities:", err);
        }
      }
    };
    fetchCities();
  }, [formData.state, formData.country, countries, states, apiUrl, citiesFetched]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedForm) => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      
      const endpoint = `${apiUrl}/student/${userId}`; // Correct endpoint for updating user
      const response = await axiosInstance.patch(endpoint, updatedForm, { // Using PATCH instead of POST
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')
        }
      });
      return response.data;
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Update error:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add email to form data from localStorage
      const email = localStorage.getItem('email')?.replace(/^"|"$/g, '');
      const updatedForm = { ...formData, email };
      
      console.log("Submitting form data:", updatedForm);
      updateProfileMutation.mutate(updatedForm);
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

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
                  required
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
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Date Of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  required
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
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
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
                  value={formData.designation || ''}
                  onChange={handleChange}
                  placeholder="UI/UX Designer | Product Designer | Mobile App Expert"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">About</label>
                <textarea
                  name="about"
                  value={formData.about || ''}
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
              <div className="mb-4">
                <label className="block font-medium mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  className="w-full border rounded px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">Select Country...</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-2">State</label>
                <select
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  disabled={!formData.country}
                >
                  <option value="">Select State...</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-2">City</label>
                <select
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  disabled={!formData.state}
                >
                  <option value="">Select City...</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
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