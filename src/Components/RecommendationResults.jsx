import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Building2, Users, MapPin, Star, GraduationCap,
  IndianRupee, Award, Target, ChevronRight, Navigation, Sparkles, Check
} from "lucide-react";

const convertToReadableFormat = (number) => {
  if (number === null || number === undefined || number === "") return "N/A";
  const n = Number(number);
  if (n === 0) return "Free";
  if (n >= 10000000) return (n / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(2).replace(/\.00$/, "") + " L";
  if (n >= 1000) return (n / 1000).toFixed(2).replace(/\.00$/, "") + " K";
  return "₹" + n.toString();
};

const SectionHeader = ({ icon: Icon, title, count, color }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2.5 rounded-xl ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">{count} recommendation{count !== 1 ? "s" : ""} found</p>
    </div>
  </div>
);

const MatchPill = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
    <Check className="w-3 h-3" /> {children}
  </span>
);

const Detail = ({ label, value }) => (
  <div className="min-w-0">
    <span className="text-gray-400">{label}: </span>
    <span className="text-gray-700 font-medium break-words">{value}</span>
  </div>
);

// city/state may be a string OR an object ({ name, iso2 }) from the API.
const locName = (v) => (v && typeof v === "object" ? (v.name || "") : (v || ""));

const CourseCard = ({ course }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          {course._bestMatch && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full shadow mb-1">
              <Sparkles className="w-3 h-3" /> Best Match
            </span>
          )}
          <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
            {course.courseTitle}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {course._examMatch === "accepted" && <MatchPill>Exam Accepted</MatchPill>}
            {course._behaviorMatch && <MatchPill>Matches your interest</MatchPill>}
            {course._courseMatch > 0 && <MatchPill>Course fit</MatchPill>}
          </div>
        </div>
        {course.coursePrice && (
          <span className="flex items-center gap-1 text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full text-sm whitespace-nowrap ml-2">
            <IndianRupee className="w-3.5 h-3.5" />
            {convertToReadableFormat(course.coursePrice)}
          </span>
        )}
      </div>

      {course._aiReason && (
        <p className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 leading-snug">
          <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
          {course._aiReason}
        </p>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
        {course.courseDurationYears || course.courseDurationMonths ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-sm">
              {course.courseDurationYears ? `${course.courseDurationYears}Y` : ""}
              {course.courseDurationMonths ? ` ${course.courseDurationMonths}M` : ""}
            </span>
          </div>
        ) : null}
        {course.cutOff && (
          <div className="flex items-center gap-2 text-gray-600">
            <Target className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-sm">Cutoff: {course.cutOff}%</span>
          </div>
        )}
        {course.courseType && (
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm">{course.courseType}</span>
          </div>
        )}
        {course.examAccepted && (
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="text-sm truncate">{course.examAccepted}</span>
          </div>
        )}
      </div>

      {(course.courseCategory || course.streams?.length || course.specialization?.length || course.ranking) && (
        <div className="grid grid-cols-1 gap-y-1.5 mb-4 text-xs">
          {course.courseCategory && <Detail label="Category" value={course.courseCategory} />}
          {course.streams?.length ? <Detail label="Streams" value={course.streams.join(", ")} /> : null}
          {course.specialization?.length ? <Detail label="Specialization" value={course.specialization.join(", ")} /> : null}
          {course.ranking && <Detail label="Ranking" value={course.ranking} />}
        </div>
      )}

      <Link
        to={`/coursesinfopage/${course._id || course.slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
      >
        View Details <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

const TierBadge = ({ tier }) => {
  const styles = {
    platinum: "bg-purple-100 text-purple-700 border-purple-200",
    gold: "bg-amber-100 text-amber-700 border-amber-200",
    silver: "bg-slate-100 text-slate-600 border-slate-200",
    bronze: "bg-orange-50 text-orange-600 border-orange-200"
  };
  const icons = {
    platinum: "★",
    gold: "◆",
    silver: "●",
    bronze: "○"
  };
  const s = styles[tier] || styles.silver;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${s}`}>
      {icons[tier] || "●"} {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "Standard"}
    </span>
  );
};

const MatchBadge = ({ match }) => {
  if (match === "same_city") return (
    <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
      <Navigation className="w-3 h-3" /> Nearby
    </span>
  );
  if (match === "same_state") return (
    <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
      <MapPin className="w-3 h-3" /> In Your State
    </span>
  );
  return null;
};

const EligBadge = ({ eligible, note }) => {
  if (eligible === false) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200" title={note}>
      ⚠ Ineligible
    </span>
  );
  if (eligible === true && note) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
      ✓ Eligible
    </span>
  );
  return null;
};

const DimBar = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-gray-500 w-16 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
    <span className="text-[10px] text-gray-400 w-6 text-right">{value}</span>
  </div>
);

const InstituteCard = ({ institute }) => {
  const t = institute._tier || "silver";
  const tierColors = {
    platinum: { text: "text-purple-600", bg: "bg-purple-50", bar: "bg-purple-500" },
    gold: { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
    silver: { text: "text-slate-500", bg: "bg-slate-50", bar: "bg-slate-400" },
    bronze: { text: "text-orange-500", bg: "bg-orange-50", bar: "bg-orange-400" }
  };
  const tc = tierColors[t] || tierColors.silver;

  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group ${t === "platinum" ? "border-purple-200 ring-1 ring-purple-100" : "border-gray-100"}`}>
      <div className={`px-5 py-2 ${tc.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <TierBadge tier={t} />
          <EligBadge eligible={institute._eligible} note={institute._eligibilityNote} />
          {institute._bestMatch && (
            <span className="text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Sparkles className="w-3 h-3" /> Best Match
            </span>
          )}
          {institute.admissionOpen && (
            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Admissions Open
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {institute._match === "same_city" && <Navigation className="w-3 h-3 text-green-600" />}
          {institute.rating && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-yellow-700">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {institute.rating}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 pt-4">
        <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
          {institute.instituteName}
        </h3>
        {(institute.city || institute.state) && (
          <p className="text-xs text-gray-400 mb-3">
            <MapPin className="w-3 h-3 inline mr-0.5" />
            {[locName(institute.city), locName(institute.state)].filter(Boolean).join(", ")}
          </p>
        )}

        {(institute._examMatch === "accepted" || institute._match || institute._behaviorMatch || institute._courseMatch > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {institute._examMatch === "accepted" && <MatchPill>Exam Accepted</MatchPill>}
            {institute._match === "same_city" && <MatchPill>In your city</MatchPill>}
            {institute._match === "same_state" && <MatchPill>In your state</MatchPill>}
            {institute._behaviorMatch && <MatchPill>Matches your interest</MatchPill>}
            {institute._courseMatch > 0 && <MatchPill>Course fit</MatchPill>}
          </div>
        )}

        {institute._aiReason && (
          <p className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 leading-snug">
            <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
            {institute._aiReason}
          </p>
        )}

        {/* ── Detailed Eligibility Rules ── */}
        {institute._eligibilityRules?.length > 0 && (
          <div className="mb-2 space-y-0.5">
            {institute._eligibilityRules.map((rule, i) => {
              const key = `${rule.type}-${i}`;
              // Determine if this rule represents a PASS or FAIL for the student
              let passed = null;
              if (rule.type === "overall_min" || rule.type === "category_min") {
                passed = institute._eligible;
              }
              if (rule.type === "exam_accepted") {
                passed = institute._examMatch === "accepted";
              }
              const color = passed === null ? "text-gray-500" : passed ? "text-green-600" : "text-red-500";
              const icon = passed === null ? "•" : passed ? "✓" : "✗";
              let label = rule.text;
              if (rule.type === "subjects_required" && rule.subjects) {
                label = `Requires: ${rule.subjects.join(", ")}`;
              }
              return (
                <p key={key} className={`text-[10px] ${color} leading-tight`}>
                  {icon} {label}
                </p>
              );
            })}
          </div>
        )}

        {(institute._reputation !== undefined) && (
          <div className="space-y-1 mb-3">
            <DimBar label="Academics" value={institute._reputation} color={tc.bar} />
            <DimBar label="Fees" value={institute._affordability} color={tc.bar} />
            <DimBar label="Infra" value={institute._infrastructure} color={tc.bar} />
            <DimBar label="Location" value={institute._location} color={tc.bar} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
          {(institute.minFees || institute.minFee) && (
            <span className="flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3" />
              {convertToReadableFormat(institute.minFees || institute.minFee)}{institute.maxFees ? `-${convertToReadableFormat(institute.maxFees)}` : ""}/yr
            </span>
          )}
          {institute.organization && <span>{institute.organization}</span>}
          {institute.examAccepted && <span className="truncate max-w-[120px]">{institute.examAccepted}</span>}
        </div>

        {(institute.ranking || institute.rank || institute.highestPackage || institute.affiliation ||
          institute.streams?.length || institute.specialization?.length || institute.facilities?.length || institute.establishedYear) && (
          <div className="grid grid-cols-1 gap-y-1.5 mb-3 text-xs">
            {institute.ranking && <Detail label="Ranking" value={institute.ranking} />}
            {institute.rank ? <Detail label="Rank" value={`#${institute.rank}`} /> : null}
            {institute.highestPackage && <Detail label="Highest Package" value={convertToReadableFormat(institute.highestPackage)} />}
            {institute.affiliation && <Detail label="Affiliation" value={institute.affiliation} />}
            {institute.streams?.length ? <Detail label="Streams" value={institute.streams.join(", ")} /> : null}
            {institute.specialization?.length ? <Detail label="Specialization" value={institute.specialization.join(", ")} /> : null}
            {institute.facilities?.length ? <Detail label="Facilities" value={institute.facilities.join(", ")} /> : null}
            {institute.establishedYear ? <Detail label="Est." value={institute.establishedYear} /> : null}
          </div>
        )}

        <div className="flex items-center justify-between">
          {institute.affiliation && (
            <span className="text-[10px] text-gray-400 truncate max-w-[180px]">{institute.affiliation}</span>
          )}
          <Link
            to={`/institute/${institute._id || institute.slug}`}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600 hover:text-red-700 shrink-0"
          >
            Details <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const CounselorCard = ({ counselor }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
    <div className="p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
          {counselor.firstname?.charAt(0)}{counselor.lastname?.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors truncate">
            {counselor.firstname} {counselor.lastname}
          </h3>
          {counselor.category && (
            <p className="text-sm text-gray-500 truncate">{counselor.category}</p>
          )}
        </div>
      </div>

      {counselor._aiReason && (
        <p className="mb-3 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 leading-snug">
          <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
          {counselor._aiReason}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {locName(counselor.city) && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm truncate">{locName(counselor.city)}</span>
          </div>
        )}
        {counselor.ExperienceYear && (
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-sm">{counselor.ExperienceYear} yrs</span>
          </div>
        )}
      </div>

      {counselor.contactno && (
        <a
          href={`tel:${counselor.contactno}`}
          className="inline-flex items-center justify-center w-full gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          <Users className="w-4 h-4" /> Contact Counselor
        </a>
      )}
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const RecommendationResults = ({ results, loading, profile }) => {
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((card) => (
                <div key={card} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-4" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results) return null;

  const { courses = [], institutes = [], counselors = [] } = results;
  const hasAny = courses.length || institutes.length || counselors.length;

  if (!hasAny) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <EmptyState
          icon={Target}
          title="No Recommendations Found"
          description="Try adjusting your criteria — lower marks, increase budget, or broaden your location preferences."
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {profile && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <span className="font-medium text-gray-900">Your Profile:</span>
            {profile.marks && (
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Target className="w-3.5 h-3.5 text-red-500" /> Marks: {profile.marks}%
              </span>
            )}
            {profile.exam && (
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-500" /> {profile.exam}
              </span>
            )}
            {profile.category && (
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Target className="w-3.5 h-3.5 text-amber-500" /> {profile.category}
              </span>
            )}
            {profile.budget && (
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <IndianRupee className="w-3.5 h-3.5 text-green-500" /> Budget: {convertToReadableFormat(profile.budget)}
              </span>
            )}
            {profile.preferredCourse && (
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" /> {profile.preferredCourse}
              </span>
            )}
            {profile.city && (
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-purple-500" /> {profile.city}
              </span>
            )}
          </div>
        </div>
      )}

      {courses.length > 0 && (
        <section>
          <SectionHeader
            icon={BookOpen}
            title="Recommended Courses"
            count={courses.length}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}

      {institutes.length > 0 && (
        <section>
          <SectionHeader
            icon={Building2}
            title="Recommended Institutes"
            count={institutes.length}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutes.map((institute) => (
              <InstituteCard key={institute._id} institute={institute} />
            ))}
          </div>
        </section>
      )}

      {counselors.length > 0 && (
        <section>
          <SectionHeader
            icon={Users}
            title="Nearby Counselors"
            count={counselors.length}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {counselors.map((counselor) => (
              <CounselorCard key={counselor._id} counselor={counselor} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RecommendationResults;
