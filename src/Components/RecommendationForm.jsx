import React, { useState, useEffect } from "react";
import { getAllStreams, getRecommendedInstitutes } from "../ApiFunctions/api";
import { useQuery } from "react-query";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const EDUCATION_LEVELS = [
  "10th Pass", "12th Pass", "Undergraduate", "Postgraduate", "Diploma", "PhD"
];

const CATEGORIES = [
  "General", "OBC", "SC", "ST", "EWS", "PwD", "NRI"
];

const EXAMS = [
  "NEET", "NEET UG", "NEET PG", "JEE Main", "JEE Advanced",
  "KEAM", "CUET", "CUET UG", "CUET PG", "MCAER", "MHT CET",
  "WBJEE", "BCECE", "AP EAMCET", "TS EAMCET", "KCET",
  "COMEDK", "MET", "BITSAT", "VITEEE", "SRMJEE",
  "GATE", "CAT", "MAT", "XAT", "NMAT",
  "CLAT", "AILET", "LSAT",
  "NATA", "CEED", "NID DAT",
  "UGC NET", "CSIR NET", "ICAR AIEEA",
  "CBSE 12th", "ICSE 12th", "State Board 12th",
];

const RecommendationForm = ({ onSubmit, loading, initialProfile }) => {
  const [streams, setStreams] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    marks: "",
    exam: "",
    category: "",
    preferredCourse: "",
    budget: "",
    state: "",
    city: "",
    preferredCollege: "",
    educationLevel: "",
  });

  useEffect(() => {
    getAllStreams().then(setStreams).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialProfile) {
      setForm((prev) => ({
        ...prev,
        marks: initialProfile.marks || prev.marks,
        exam: initialProfile.exam || prev.exam,
        preferredCourse: initialProfile.preferredCourse || prev.preferredCourse,
        budget: initialProfile.budget || prev.budget,
        state: initialProfile.state || prev.state,
        city: initialProfile.city || prev.city,
        preferredCollege: initialProfile.preferredCollege || prev.preferredCollege,
      }));
    }
  }, [initialProfile]);

  useEffect(() => {
    if (form.state) {
      const fetchCities = async () => {
        try {
          const response = await axios.post(`${baseURL}/cities-by-state`, {
            state: form.state
          });
          const data = response.data?.data || response.data?.cities || [];
          setCities(Array.isArray(data) ? data : []);
        } catch {
          setCities([]);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [form.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Tell Us About Yourself
      </h2>
      <p className="text-gray-600 mb-6">
        Fill in your details and we will recommend the best courses, colleges,
        and counselors tailored to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>
              Your Marks / Percentage *
            </label>
            <input
              type="number"
              name="marks"
              value={form.marks}
              onChange={handleChange}
              placeholder="e.g. 85"
              min="0"
              max="100"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Entrance Exam
            </label>
            <select
              name="exam"
              value={form.exam}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select your exam...</option>
              {EXAMS.map((exam) => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Category / Caste
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Education Level
            </label>
            <select
              name="educationLevel"
              value={form.educationLevel}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select level...</option>
              {EDUCATION_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Budget (Annual Fees) *
            </label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 500000"
              min="0"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Preferred Course / Stream
            </label>
            <select
              name="preferredCourse"
              value={form.preferredCourse}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a stream...</option>
              {streams.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              State
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select state...</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              City
            </label>
            {cities.length > 0 ? (
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select city...</option>
                {cities.map((c) => {
                  const name = typeof c === "string" ? c : c.name || c.city || "";
                  const id = typeof c === "string" ? c : c._id || name;
                  return (
                    <option key={id} value={name}>{name}</option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className={inputClass}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Preferred College (Optional)
            </label>
            <input
              type="text"
              name="preferredCollege"
              value={form.preferredCollege}
              onChange={handleChange}
              placeholder="e.g. Delhi University"
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-[#b82025] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Finding Recommendations..." : "Get Personalized Recommendations"}
        </button>
      </form>
    </div>
  );
};

export default RecommendationForm;
