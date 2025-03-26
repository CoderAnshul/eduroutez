import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import axiosInstance from "../ApiFunctions/axios";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

// Fetch the user data
const fetchUserData = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("User ID not found in localStorage");
  }
  const response = await axiosInstance.get(
    `${VITE_BASE_URL}/student/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("accessToken"),
        "x-refresh-token": localStorage.getItem("refreshToken"),
      },
    }
  );
  return response.data.data;
};

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    designation: "",
    about: "",
    address: "",
    country: "",
    state: "",
    city: "",
    // Store the name values separately for display purposes
    countryName: "",
    stateName: "",
    cityName: "",
  });

  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Track when location data needs to be loaded
  const [countryLoaded, setCountryLoaded] = useState(false);
  const [statesLoaded, setStatesLoaded] = useState(false);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  // Fetch user data
  const { isLoading } = useQuery("userData", fetchUserData, {
    onSuccess: (data) => {
      // Format date properly
      const formattedDate =
        data.dateOfBirth && !isNaN(new Date(data.dateOfBirth))
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : null;

      // Set form data with user data
      setFormData({
        name: data.name || "",
        email:
          data.email || localStorage.getItem("email")?.replace(/^"|"$/g, ""),
        phone: data.phone || "",
        dateOfBirth: formattedDate,
        gender: data.gender || "Male",
        designation: data.designation || "",
        about: data.about || "",
        address: data.address || "",
        country: data.country?._id || "", // Use _id initially
        state: data.state?._id || "",
        city: data.city?._id || "",
        // Store the name values for display
        countryName: data.country?.name || "",
        stateName: data.state?.name || "",
        cityName: data.city?.name || "",
      });

      // Set flags to load location data if needed
      if (data.country?._id) {
        setCountryLoaded(true);
      }
    },
    onError: (error) => {
      alert("Error fetching user data: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      // Find the selected country to get its name
      const selectedCountry = countries.find(
        (country) => country.id.toString() === value
      );

      setFormData({
        ...formData,
        [name]: value,
        countryName: selectedCountry?.name || "",
        state: "", // Reset dependent fields
        stateName: "",
        city: "",
        cityName: "",
      });
      // Reset states and cities when country changes
      setStatesLoaded(false);
      setCitiesLoaded(false);
    } else if (name === "state") {
      // Find the selected state to get its name
      const selectedState = states.find(
        (state) => state.id.toString() === value
      );

      setFormData({
        ...formData,
        [name]: value,
        stateName: selectedState?.name || "",
        city: "", // Reset city when state changes
        cityName: "",
      });
      // Reset cities when state changes
      setCitiesLoaded(false);
    } else if (name === "city") {
      // Find the selected city to get its name
      const selectedCity = cities.find((city) => city.id.toString() === value);

      setFormData({
        ...formData,
        [name]: value,
        cityName: selectedCity?.name || "",
      });
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

        // If we have country data from the API, try to match it with the fetched countries
        if (formData.countryName && !formData.country && res.data?.data) {
          const matchedCountry = res.data.data.find(
            (country) => country.name === formData.countryName
          );
          if (matchedCountry) {
            setFormData((prev) => ({
              ...prev,
              country: matchedCountry.id,
            }));
            setCountryLoaded(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, [apiUrl, formData.countryName]);

  // Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      // Only fetch states if we have a country and haven't already loaded states for this country
      if (!formData.country || statesLoaded) return;

      try {
        // Find the selected country to get its ISO code
        const selectedCountry = countries.find(
          (country) => country.id.toString() === formData.country.toString()
        );
        if (selectedCountry) {
          const res = await axiosInstance.post(`${apiUrl}/states-by-country`, {
            countryCode: selectedCountry.iso2,
          });
          setStates(res.data?.data || []);

          // If we have state data from the API, try to match it with the fetched states
          if (formData.stateName && !formData.state && res.data?.data) {
            const matchedState = res.data.data.find(
              (state) => state.name === formData.stateName
            );
            if (matchedState) {
              setFormData((prev) => ({
                ...prev,
                state: matchedState.id,
              }));
            }
          }

          setStatesLoaded(true);
        }
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };

    if (countries.length > 0 && formData.country) {
      fetchStates();
    }
  }, [formData.country, countries, apiUrl, statesLoaded, formData.stateName]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      // Only fetch cities if we have a country and state and haven't already loaded cities for this state
      if (!formData.state || !formData.country || citiesLoaded) return;

      try {
        // Get the country and state ISO codes for the API request
        const selectedCountry = countries.find(
          (country) => country.id.toString() === formData.country.toString()
        );
        const selectedState = states.find(
          (state) => state.id.toString() === formData.state.toString()
        );

        if (selectedCountry && selectedState) {
          const res = await axiosInstance.post(`${apiUrl}/cities-by-state`, {
            countryCode: selectedCountry.iso2,
            stateCode: selectedState.iso2,
          });
          setCities(res.data?.data || []);

          // If we have city data from the API, try to match it with the fetched cities
          if (formData.cityName && !formData.city && res.data?.data) {
            const matchedCity = res.data.data.find(
              (city) => city.name === formData.cityName
            );
            if (matchedCity) {
              setFormData((prev) => ({
                ...prev,
                city: matchedCity.id,
              }));
            }
          }

          setCitiesLoaded(true);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };

    if (states.length > 0 && formData.state) {
      fetchCities();
    }
  }, [
    formData.state,
    formData.country,
    countries,
    states,
    apiUrl,
    citiesLoaded,
    formData.cityName,
  ]);

  // This effect is triggered when user data is loaded and country is set
  useEffect(() => {
    if (countryLoaded && formData.country && countries.length > 0) {
      // Reset the flag so this only runs once per country selection
      setCountryLoaded(false);
      setStatesLoaded(false); // Force states to load for this country
    }
  }, [countryLoaded, formData.country, countries]);

  // This effect is triggered when states are loaded and state is set from user data
  useEffect(() => {
    if (statesLoaded && formData.state && states.length > 0) {
      setCitiesLoaded(false); // Force cities to load for this state
    }
  }, [statesLoaded, formData.state, states]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedForm) => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }

      const endpoint = `${apiUrl}/student/${userId}`;
      const response = await axiosInstance.patch(endpoint, updatedForm, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken"),
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
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
      const email = localStorage.getItem("email")?.replace(/^"|"$/g, "");

      // Create the payload with nested objects for location data
      const updatedForm = {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        designation: formData.designation,
        about: formData.about,
        address: formData.address,
        email: email,
      };

      // Only add location data if they exist
      if (formData.country) {
        const selectedCountry = countries.find(
          (country) => country.id.toString() === formData.country.toString()
        );
        if (selectedCountry) {
          updatedForm.country = {
            name: selectedCountry.name,
            iso2: selectedCountry.iso2,
          };
        }
      }

      if (formData.state) {
        const selectedState = states.find(
          (state) => state.id.toString() === formData.state.toString()
        );
        if (selectedState) {
          updatedForm.state = {
            name: selectedState.name,
            iso2: selectedState.iso2,
          };
        }
      }

      if (formData.city) {
        const selectedCity = cities.find(
          (city) => city.id.toString() === formData.city.toString()
        );
        if (selectedCity) {
          updatedForm.city = {
            name: selectedCity.name,
          };
        }
      }

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
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
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
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full border rounded px-4 py-2 bg-gray-100 cursor-not-allowed"
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
                  value={formData.dateOfBirth || ""}
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
                  value={formData.designation || ""}
                  onChange={handleChange}
                  placeholder="UI/UX Designer | Product Designer | Mobile App Expert"
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">About</label>
                <textarea
                  name="about"
                  value={formData.about || ""}
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
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  className="w-full border rounded px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                >
                  <option value="">
                    {formData.countryName
                      ? `${formData.countryName} (Selected)`
                      : "Select Country..."}
                  </option>
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
                  value={formData.state || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  disabled={!formData.country}
                >
                  <option value="">
                    {formData.stateName
                      ? `${formData.stateName} (Selected)`
                      : "Select State..."}
                  </option>
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
                  value={formData.city || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                  disabled={!formData.state}
                >
                  <option value="">
                    {formData.cityName
                      ? `${formData.cityName}`
                      : "Select City..."}
                  </option>
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
              className="px-6 py-3 bg-[#b82025] text-white font-semibold rounded shadow-md hover:bg-[#b82025] transition"
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
