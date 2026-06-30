import React, { useState, useCallback, useMemo, useEffect } from "react";
import RecommendationForm from "../Components/RecommendationForm";
import RecommendationResults from "../Components/RecommendationResults";
import { getFilteredRecommendations, quickNearby } from "../ApiFunctions/api";
import { Sparkles, ArrowLeft, BookOpen, Building2, Users, Navigation, MapPin } from "lucide-react";

const RecommendationsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const initialProfile = useMemo(() => {
    const marks = localStorage.getItem("marks");
    const state = localStorage.getItem("state");
    const city = localStorage.getItem("city");
    if (marks || state || city) {
      return { marks: marks || "", state: state || "", city: city || "" };
    }
    return null;
  }, []);

  const userCity = initialProfile?.city;
  const userState = initialProfile?.state;

  useEffect(() => {
    if (nearbyOnly && (userCity || userState)) {
      handleNearby();
    }
  }, [nearbyOnly]);

  const handleSubmit = useCallback(async (form) => {
    setLoading(true);
    setError(null);
    setProfile(form);
    setNearbyOnly(false);
    try {
      const data = await getFilteredRecommendations(form);
      setResults(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNearby = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNearbyOnly(false);
    const loc = { state: userState, city: userCity, budget: localStorage.getItem("budget") };
    setProfile(loc);
    try {
      const institutes = await quickNearby(loc);
      setResults({ courses: [], institutes, counselors: [] });
    } catch (err) {
      setError("Could not find nearby institutes.");
    } finally {
      setLoading(false);
    }
  }, [userState, userCity]);

  const handleReset = () => {
    setResults(null);
    setProfile(null);
    setError(null);
    setNearbyOnly(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-4">
            <Sparkles className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Personalized Recommendations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tell us about your academic profile and preferences. We'll find the best
            courses, colleges, and counselors tailored just for you.
          </p>
        </div>

        {(userCity || userState) && !results && !loading && (
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <button
              onClick={handleNearby}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
            >
              <Navigation className="w-5 h-5" />
              Quick Nearby Institutes
            </button>
          </div>
        )}

        {!results && !loading && !nearbyOnly && (
          <div className="max-w-3xl mx-auto">
            <RecommendationForm onSubmit={handleSubmit} loading={loading} initialProfile={initialProfile} />
          </div>
        )}

        {loading && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <button onClick={handleReset} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                Try Again
              </button>
            </div>
          </div>
        )}

        {results && !loading && (
          <div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Refine Your Search</span>
            </button>
            <RecommendationResults results={results} loading={false} profile={profile} />
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Course Matching</h3>
            <p className="text-sm text-gray-500">Courses matched to your marks, stream preference, and budget.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">College Finder</h3>
            <p className="text-sm text-gray-500">Institutes in your preferred location matching your academic profile.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Local Counselors</h3>
            <p className="text-sm text-gray-500">Nearby guidance counselors who can help you make the right choice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
