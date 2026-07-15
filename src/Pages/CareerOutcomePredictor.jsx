/* eslint-disable react/prop-types */
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import {
  ArrowLeft, IndianRupee, Target, TrendingUp, GraduationCap,
  Building2, Briefcase
} from "lucide-react";
import { careers, predictCareerOutcome } from "../ApiFunctions/api";

const EDUCATION_LEVELS = [
  "12th Pass", "Undergraduate", "Postgraduate", "Diploma", "PhD"
];

const CareerOutcomePredictor = () => {
  const [form, setForm] = useState({ career: "", careerId: "", educationLevel: "", location: "", skills: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: careersData } = useQuery({
    queryKey: ["career-outcome-careers"],
    queryFn: () => careers(1),
    staleTime: 5 * 60 * 1000,
  });
  const careerOptions = useMemo(() => {
    const nested = careersData?.data?.result || careersData?.result || careersData;
    return Array.isArray(nested) ? nested : [];
  }, [careersData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "careerId") {
      const selected = careerOptions.find((c) => c._id === value);
      setForm((prev) => ({ ...prev, careerId: value, career: selected ? selected.title : "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.career && !form.careerId) {
      setError("Please enter or select a career/field.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await predictCareerOutcome({
        career: form.career || undefined,
        careerId: form.careerId || undefined,
        educationLevel: form.educationLevel || undefined,
        location: form.location || undefined,
        skills: form.skills || undefined,
      });
      setResult(data);
    } catch {
      setError("Could not generate the prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [form, careerOptions]);

  const handleReset = () => {
    setResult(null);
    setError(null);
    setForm({ career: "", careerId: "", educationLevel: "", location: "", skills: "" });
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            AI Career Outcome Predictor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get an AI-powered outlook for any career — expected salary range,
            placement chances, growth trajectory, and higher-study options.
          </p>
        </div>

        {!result && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Career / Field *</label>
                <input
                  type="text"
                  name="career"
                  value={form.career}
                  onChange={handleChange}
                  list="career-list"
                  placeholder="e.g. Data Science, Mechanical Engineering"
                  className={inputClass}
                />
                <datalist id="career-list">
                  {careerOptions.map((c) => (
                    <option key={c._id} value={c.title} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-400 mt-1">
                  Pick from the list or type your own. You can also select a saved career below.
                </p>
              </div>

              <div>
                <label className={labelClass}>Or select from catalogue</label>
                <select
                  name="careerId"
                  value={form.careerId}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">— Select a career —</option>
                  {careerOptions.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Education Level</label>
                  <select
                    name="educationLevel"
                    value={form.educationLevel}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select level...</option>
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Preferred Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, Maharashtra"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Skills / Interests (optional)</label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g. Python, problem-solving, design"
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-[#b82025] text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Analyzing Career..." : "Predict My Career Outcome"}
              </button>
            </form>
          </div>
        )}

        {loading && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 animate-pulse space-y-4">
              <div className="h-6 w-56 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">New Prediction</span>
              </button>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${result.source === "ai" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
                {result.source === "ai" ? "AI Generated" : "Estimated (AI not configured)"}
              </span>
            </div>

            <SectionHeader icon={Briefcase} title={result.career || "Career Outcome"} color="bg-gradient-to-br from-indigo-500 to-indigo-600" />

            {/* Salary Range */}
            <section className="mb-10">
              <SubHeader icon={IndianRupee} title="Expected Salary Range" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SalaryCard label="Entry Level" value={result.salaryRange?.entryLevel} />
                <SalaryCard label="Mid Level" value={result.salaryRange?.midLevel} />
                <SalaryCard label="Senior Level" value={result.salaryRange?.seniorLevel} />
              </div>
              {result.salaryRange?.note && <p className="text-sm text-gray-500 mt-3">{result.salaryRange.note}</p>}
            </section>

            {/* Placement Chances */}
            <section className="mb-10">
              <SubHeader icon={Target} title="Placement Chances" />
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {result.placementChances?.rating} · {result.placementChances?.percentage}%
                  </span>
                  <span className="text-xs text-gray-400">likelihood</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${result.placementChances?.percentage || 0}%` }}
                  />
                </div>
                {result.placementChances?.note && <p className="text-sm text-gray-500 mt-3">{result.placementChances.note}</p>}
              </div>
            </section>

            {/* Career Growth */}
            <section className="mb-10">
              <SubHeader icon={TrendingUp} title="Career Growth" />
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm text-gray-600 mb-4">
                  Outlook: <span className="font-semibold text-gray-900">{result.careerGrowth?.outlook}</span>
                  {result.careerGrowth?.note ? ` — ${result.careerGrowth.note}` : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(result.careerGrowth?.timeline || []).map((t, i) => (
                    <div key={i} className="rounded-lg bg-indigo-50 p-4">
                      <p className="text-xs font-bold text-indigo-700">{t.year}</p>
                      <p className="text-sm font-semibold text-gray-800">{t.level}</p>
                      <p className="text-xs text-gray-500 mt-1">{t.remark}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Higher Study */}
            <section className="mb-10">
              <SubHeader icon={GraduationCap} title="Higher-Study Opportunities" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(result.higherStudy || []).map((h, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">{h.option}</p>
                      <p className="text-sm text-gray-500 mt-1">{h.description}</p>
                    </div>
                    <ValueBadge value={h.value} />
                  </div>
                ))}
              </div>
            </section>

            {/* Top Recruiters */}
            {result.topRecruiters?.length > 0 && (
              <section className="mb-10">
                <SubHeader icon={Building2} title="Top Recruiters" />
                <div className="flex flex-wrap gap-2">
                  {result.topRecruiters.map((r, i) => (
                    <span key={i} className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">{r}</span>
                  ))}
                </div>
              </section>
            )}

            {result.summary && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
                <p className="text-gray-700 leading-relaxed">{result.summary}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <FeatureCard icon={IndianRupee} title="Salary Range" text="Entry to senior-level pay bands." />
          <FeatureCard icon={Target} title="Placement" text="Likelihood of landing a job." />
          <FeatureCard icon={TrendingUp} title="Growth" text="Multi-year career trajectory." />
          <FeatureCard icon={GraduationCap} title="Higher Study" text="PG & certification value." />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`p-2.5 rounded-xl ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </div>
);

const SubHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-indigo-500" />
    <h3 className="font-semibold text-gray-700">{title}</h3>
  </div>
);

const SalaryCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
    <p className="text-xs text-gray-400 mb-2">{label}</p>
    <div className="flex items-center gap-1.5 text-green-700 font-bold">
      <IndianRupee className="w-4 h-4" />
      <span>{value || "N/A"}</span>
    </div>
  </div>
);

const ValueBadge = ({ value }) => {
  const styles = {
    High: "bg-green-100 text-green-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-gray-100 text-gray-600",
  };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles[value] || styles.Low}`}>{value}</span>;
};

const FeatureCard = ({ icon: Icon, title, text }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

export default CareerOutcomePredictor;
