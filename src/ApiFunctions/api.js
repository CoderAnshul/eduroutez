import axios from "axios";
import axiosInstance, { cachedGet } from './axios';

const baseURL = import.meta.env.VITE_BASE_URL;

// Helper to normalize different server response shapes
const normalize = (res) => {
  try {
    return res?.data?.data ?? res?.dat / career - categorya ?? res;
  } catch {
    return res;
  }
};

export const getInstitutes = async (
  state,
  city,
  instituteName,
  courseTitle,
  page = 1,
  limit = 20,
  organization,
  organisationType
) => {
  try {
    // Construct the filters object dynamically based on the input
    const searchFields = {
      ...(state && { state }),
      ...(city && { city }),
      ...(instituteName && { instituteName }),
      ...(courseTitle && { courseTitle }),
      ...(organization && { organization }),
      ...(organisationType && { organisationType }),
    };
    // console.log("Search Fields:", searchFields);

    const response = await axiosInstance.get(`/institutes`, {
      params: {
        searchFields: JSON.stringify(searchFields),
        page: page,
        limit: limit, // Limit results to improve loading time
      },
    });

    return normalize(response);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    throw error;
  }
};

// ── Activity Tracking ─────────────────────────────────────────────────────

export const getUserActivity = async (page = 1, limit = 20) => {
  try {
    const response = await axiosInstance.get(`/activity`, {
      params: { page, limit }
    });
    return normalize(response);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return { activities: [], total: 0 };
  }
};

export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`/activity/recent`, {
      params: { limit }
    });
    return normalize(response);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};

export const getActivityStats = async () => {
  try {
    const response = await axiosInstance.get(`/activity/stats`);
    return normalize(response);
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    return { total: 0, likes: 0, wishlists: 0, reviews: 0 };
  }
};

export const addToWishlist = async ({ instituteId, courseId, customHeaders } = {}) => {
  try {
    const body = {};
    if (instituteId) body.instituteId = instituteId;
    if (courseId) body.courseId = courseId;
    const headers = customHeaders || {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken'),
      'x-refresh-token': localStorage.getItem('refreshToken')
    };
    const response = await axios.post(`${baseURL}/wishlist/`, body, { headers });
    return normalize(response);
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    throw error;
  }
};

export const blogById = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);

    // Determine if we're dealing with an ID or a slug
    const isSlug = isNaN(parseInt(idOrSlug)) || idOrSlug.includes("-");

    let response;

    if (isSlug) {
      response = await cachedGet(`${baseURL}/blog/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      response = await cachedGet(`${baseURL}/blog/${idOrSlug}`);
    }

    return { data: normalize(response) };
  } catch (error) {
    console.error(`Error fetching blog:`, error);
    throw error;
  }
};
//getRecentBlogs
export const getRecentBlogs = async () => {
  try {
    const response = await cachedGet(`${baseURL}/blogs?limit=5&sort={"createdAt":"desc"}`);
    return { data: normalize(response) };
  } catch (error) {
    console.error(`Error fetching recent blogs:`, error);
    throw error;
  }
};


export const CarrerDetail = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);

    const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(idOrSlug));
    console.log("[CarrerDetail] route type", { idOrSlug, isObjectId });

    let response;

    const extractPayload = (res) => {
      const normalized = normalize(res);

      if (normalized?.result && Array.isArray(normalized.result)) {
        return normalized.result[0] || null;
      }

      if (normalized?.data?.result && Array.isArray(normalized.data.result)) {
        return normalized.data.result[0] || null;
      }

      return normalized;
    };

    // Use collection filter endpoint for both ID and slug to avoid /careers/:id calls.
    const filters = isObjectId
      ? { _id: String(idOrSlug) }
      : { slug: String(idOrSlug) };

    response = await cachedGet(`${baseURL}/careers`, {
      params: {
        filters: JSON.stringify(filters),
        limit: 1,
      },
    });

    console.log("[CarrerDetail] raw response", response);
    const payload = extractPayload(response);
    console.log("[CarrerDetail] normalized payload", payload);
    console.log("[CarrerDetail] response status", response?.status, response?.statusText);
    return payload;
  } catch (error) {
    console.error(`Error fetching career detail:`, error);
    console.error("[CarrerDetail] error response", error?.response?.status, error?.response?.statusText, error?.response?.data);
    throw error;
  }
};

export const getInstituteById = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);

    // Determine if we're dealing with an ID or a slug
    const isSlug = isNaN(parseInt(idOrSlug)) || idOrSlug.includes("-");

    let response;

    if (isSlug) {
      response = await axiosInstance.get(`/institute/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      response = await axiosInstance.get(`/institute/${idOrSlug}`);
    }

    // Return wrapped shape so callers expecting `response.data` stay compatible
    return { data: normalize(response) };
  } catch (error) {
    console.error(`Error fetching institute detail:`, error);
    throw error;
  }
};
export const getCoursesById = async (idOrSlug) => {
  try {
    console.log("Processing request for:", idOrSlug);

    // Determine if we're dealing with an ID or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const isSlug = !isObjectId;

    let response;

    if (isSlug) {
      response = await cachedGet(`${baseURL}/course/${idOrSlug}`, {
        params: { field: "slug" }
      });
    } else {
      response = await cachedGet(`${baseURL}/course/${idOrSlug}`);
    }

    // Normalize and return the inner payload (server uses { data: { ... } })
    return normalize(response);
  } catch (error) {
    console.error(`Error fetching course detail:`, error);
    throw error;
  }
};

export const getWebinars = async ({ search = "", page = 1, limit = 10 } = {}) => {
  try {
    const params = {
      search,
      page,
      limit,
    };

    const response = await axiosInstance.get(`/webinars`, { params });
    // Return wrapped shape { data: ... } for compatibility with callers
    return { data: normalize(response) };
  } catch (error) {
    console.error("Error fetching webinars:", error);
    throw error;
  }
};

export const createReview = async (formData) => {
  try {
    const response = await axiosInstance.post(`/review`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return normalize(response);
  } catch (error) {
    console.error(`Error creating review:`, error.message);
    throw error;
  }
};

export const getReviews = async () => {
  try {
    const response = await axiosInstance.get(`/review`);
    return normalize(response);
  } catch (error) {
    console.error(error);
  }
};

export const adds = async () => {
  try {
    const response = await axios.get(`${baseURL}/promotions`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching adds `, error);
    throw error;
  }
};
export const homeBanner = async () => {
  try {
    const response = await axios.get(`${baseURL}/media`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);
    throw error;
  }
};
export const blogs = async (page) => {
  try {
    console.log("blogs");
    const response = await axios.get(`${baseURL}/blogs?sortCon={"createdAt":"desc"}`, {
      params: {
        page,
        limit: 8
      },
    });
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);

    throw error;
  }
};

export const getBlogs = async () => {
  try {
    console.log("blogs");
    const response = await axios.get(`${baseURL}/blogs?sort={"createdAt":"desc"}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blogs `, error.message);
    throw error;
  }
};

export const createQuery = async (formData) => {
  try {

    const response = await axios.post(`${baseURL}/query`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching institute with ID :`, error);
  }
};

export const postQuestion = async (formData) => {
  try {
    const response = await axiosInstance.post(`/question-answer`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error posting question:`, error);
    throw error;
  }
};

export const updateQuestion = async (id, formData) => {
  try {
    const response = await axiosInstance.patch(`/question-answer/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error updating question:`, error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/question-answer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting question:`, error);
    throw error;
  }
};

export const getMyQuestions = async (status = "published") => {
  try {
    const response = await axiosInstance.get(`/my-questions?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching my questions:`, error);
    throw error;
  }
};

export const careers = async (page) => {
  try {
    const response = await axios.get(`${baseURL}/careers?sort={"createdAt":"desc"}`, {
      params: {
        page,
        limit: 8
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching careers:`, error);
    throw error;
  }
};
export const counsellers = async () => {
  try {
    const response = await axios.get(`${baseURL}/counselors`);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching banner `, error);

    throw error;
  }
};
export const popularCourses = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/courses?filters={"isCoursePopular":true}&limit=3`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching Popular courses `, error);

    throw error;
  }
};

export const AllpopularCourses = async (params = {}) => {
  try {
    // Destructure with default values
    const {
      page = 1,
      limit = 10,
      filters = {},
      search = ''
    } = params;

    // Prepare query parameters
    const queryParams = {
      page: page - 1, // Convert to 0-indexed
      limit,
      filters: typeof filters === 'object' ? JSON.stringify(filters) : filters,
      search
    };

    // Remove undefined or null values
    Object.keys(queryParams).forEach(key =>
      queryParams[key] === undefined && delete queryParams[key]
    );

    const response = await axios.get(`${baseURL}/courses`, {
      params: queryParams
    });


    return response;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const courseCategoriesList = async (params = {}) => {
  try {
    const { page = 0, limit = 10000 } = params;

    const response = await axios.get(`${baseURL}/course-categories`, {
      params: { page, limit }
    });

    console.log('courseCategoriesList', response);

    return response;
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }
};


export const bestRatedInstitute = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/best-rated-institute?filters={"limit":3}&sort={"createdAt":"desc"}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching best-rated-institute `, error);
    throw error;
  }
};

export const bestRatedUniversityInstitutes = async () => {
  try {
    const filters = {
      isBestRatedUniversity: true,
      organization: "University",
    };

    const response = await axios.get(`${baseURL}/institutes`, {
      params: {
        filters: JSON.stringify(filters),
        page: 1,
        limit: 20,
      },
    });

    const institutes = response?.data?.data?.result || [];
    return { data: institutes };
  } catch (error) {
    console.error(`Error fetching best-rated university institutes `, error);
    throw error;
  }
};



export const allbestRatedInstitute = async () => {
  try {
    const response = await axios.get(`${baseURL}/best-rated-institute`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching best-rated-institute `, error);
    throw error;
  }
};

export const trendingInstitute = async () => {
  try {
    console.log("trendingInstitute", `${baseURL}/institutes?filters={"isTrending":true}&limit=3`);
    const response = await axios.get(
      `${baseURL}/institutes?filters={"isTrending":true}&limit=3`
    );
    console.log('tred', response.data);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching trending institute `, error);

    throw error;
  }
};

export const alltrendingInstitute = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/institutes?filters={"isTrending":true}`
    );
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching trending institute `, error);

    throw error;
  }
};

//careerCategories
export const careerCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/career-category?page=0&limit=10000`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching career categories `, error);
    throw error;
  }
};



export const career = async () => {
  try {
    const response = await axios.get(`${baseURL}/careers?limit=3&sort={"createdAt":"desc"}`);
    return response.data;

    // return response.data;s
  } catch (error) {
    console.error(`Error fetching career `, error);

    throw error;
  }
};
export const category = async () => {
  try {
    const response = await axios.get(`${baseURL}/streams?limit=8&sort={"createdAt":"asc"}`);
    console.log("response", response);
    return response.data;

    // return response.data;
  } catch (error) {
    console.error(`Error fetching category `, error);

    throw error;
  }
};

// Streams filtered by type
export const getCounsellorStreams = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/streams?limit=15&sort={"createdAt":"asc"}&filters={"isCounsellorStream":true}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching counsellor streams `, error);
    throw error;
  }
};

export const getCourseStreams = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/streams?limit=15&sort={"createdAt":"asc"}&filters={"isCourseStream":true}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching course streams `, error);
    throw error;
  }
};

export const getAccStreams = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/streams?limit=15&sort={"createdAt":"asc"}&filters={"isAccStream":true}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching acc streams `, error);
    throw error;
  }
};

// ─── Recommendation Engine API ───────────────────────────────────────────────

const normText = (title) =>
  (title || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();

const getInstFee = (inst) => Number(inst.minFees || inst.minFee || 0);

// ── Eligibility Check: Parse ALL criteria from HTML ────────────────────────

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const parseAllEligibility = (inst) => {
  const html = [inst.cutoff, inst.admissionInfo].filter(Boolean).join(" ");
  const text = stripHtml(html);
  if (!text) return { rules: [], raw: "" };

  const rules = [];

  // ─── Category-wise percentages ───
  // Matches: "General category: 50%", "SC/ST/OBC: 40%", "PwD: 45% aggregate"
  const catPattern = /(general|sc|st|obc|pwd|ews|nri|management|allied|fee\s*waiver)\s*(?:category|quota|candidates)?[:\s]+(?:minimum\s+)?(?:marks\s+)?(?:of\s+)?(\d{1,3})\s*%/gi;
  let m;
  while ((m = catPattern.exec(text)) !== null) {
    rules.push({
      type: "category_min",
      category: m[1].trim().toLowerCase(),
      value: parseInt(m[2]),
      text: m[0]
    });
  }

  // Also match "SC/ST/OBC: 40%" (slash-separated group → expand to individual rules)
  const groupPattern = /\b(general|sc|st|obc|pwd|ews|nri)(?:\/(general|sc|st|obc|pwd|ews|nri))+\s*(?:category|quota|candidates)?[:\s]+(?:minimum\s+)?(?:marks\s+)?(?:of\s+)?(\d{1,3})\s*%/gi;
  while ((m = groupPattern.exec(text)) !== null) {
    const val = parseInt(m[m.length - 1]); // last capture is the percentage
    // First captured group is the first category in the slash chain
    // Collect all categories from the match
    const cats = [];
    for (let i = 1; i < m.length - 1; i++) {
      if (m[i] && !cats.includes(m[i].toLowerCase())) cats.push(m[i].toLowerCase());
    }
    for (const cat of cats) {
      const exists = rules.some((r) => r.type === "category_min" && r.category === cat && r.value === val);
      if (!exists) {
        rules.push({ type: "category_min", category: cat, value: val, text: `${cat}: ${val}%` });
      }
    }
  }

  // ─── Subject-specific percentages ───
  // "45% in Physics, Mathematics & Chemistry"
  const subjPattern = /(\d{1,3})\s*%\s*(?:in|for|aggregate\s+in)\s+((?:physics|chemistry|biology|biotechnology|mathematics|maths|pcb|pcm|english)[^.,\d]*(?:physics|chemistry|biology|biotechnology|mathematics|maths|pcb|pcm|english)?)/gi;
  while ((m = subjPattern.exec(text)) !== null) {
    rules.push({
      type: "subject_min",
      subjects: m[2].trim().toLowerCase(),
      value: parseInt(m[1]),
      text: m[0]
    });
  }

  // ─── General minimum percentages ───
  // "minimum 50%", "at least 45%", "50% aggregate", "60% and above"
  const genPatterns = [
    /(?:minimum|at least|required|should have|must have|eligibility|criteria)\s*(?:of|is|:)?\s*(\d{1,3})\s*%/gi,
    /(\d{1,3})\s*%\s*(?:aggregate|overall|marks|and above|& above|or above)/gi,
    /(\d{1,3})\s*%\s*(?:score|percentile|cutoff|cut.?off)/gi,
  ];
  for (const pat of genPatterns) {
    while ((m = pat.exec(text)) !== null) {
      const val = parseInt(m[1]);
      if (val >= 20 && val <= 100) {
        // Avoid duplicating category-specific rules already found
        const nearby = text.slice(Math.max(0, m.index - 30), m.index + 60).toLowerCase();
        const hasCategory = /general|sc|st|obc|pwd|ews|nri/i.test(nearby);
        if (!hasCategory) {
          rules.push({ type: "overall_min", value: val, text: m[0] });
        }
      }
    }
  }

  // ─── Age requirements ───
  const agePattern = /(?:age|years\s+old|years\s+of\s+age)\s*(?:limit|requirement|criteria)?[:\s]*(\d{1,2})\s*(?:years?|yrs?)/gi;
  while ((m = agePattern.exec(text)) !== null) {
    rules.push({ type: "age", value: parseInt(m[1]), text: m[0] });
  }
  // "at least 17 years old"
  const ageMinPattern = /(?:at\s+least|minimum|above)\s*(\d{1,2})\s*(?:years?|yrs?)/gi;
  while ((m = ageMinPattern.exec(text)) !== null) {
    rules.push({ type: "age_min", value: parseInt(m[1]), text: m[0] });
  }

  // ─── Subject requirements (must have X, Y, Z) ───
  const subjects = ["physics", "chemistry", "biology", "biotechnology", "mathematics", "maths", "english"];
  const subjRequired = [];

  // ─── PCB/PCM shorthand → expand ───
  if (/\bpcb\b/i.test(text)) {
    for (const s of ["physics", "chemistry", "biology"]) {
      if (!subjRequired.includes(s)) subjRequired.push(s);
    }
  }
  if (/\bpcm\b/i.test(text)) {
    for (const s of ["physics", "chemistry", "mathematics"]) {
      if (!subjRequired.includes(s)) subjRequired.push(s);
    }
  }

  // ─── 10+2/12th requirement ───
  if (/(?:10\+2|10th|12th|higher\s*secondary|intermediate|hsc)\s*(?:with|in|passed|completed|qualified)/i.test(text)) {
    if (!subjRequired.some((s) => s === "10+2")) {
      rules.push({ type: "qualification", text: "10+2 / Higher Secondary required" });
    }
  }
  for (const s of subjects) {
    const re = new RegExp(`(?:must have|should have|with|including|compulsory|required|core)[^.]*?${s}`, "i");
    if (re.test(text)) subjRequired.push(s);
  }
  // Also check "Physics, Chemistry, Biology/Biotechnology" pattern
  const subjListPattern = /(physics|chemistry|biology|biotechnology|mathematics|maths|english)(?:\s*[,/&]\s*(physics|chemistry|biology|biotechnology|mathematics|maths|english))+/gi;
  while ((m = subjListPattern.exec(text)) !== null) {
    const found = m[0].toLowerCase();
    for (const s of subjects) {
      if (found.includes(s) && !subjRequired.includes(s)) subjRequired.push(s);
    }
  }
  if (subjRequired.length) {
    rules.push({ type: "subjects_required", subjects: subjRequired, text: subjRequired.join(", ") });
  }

  // ─── Marks exemption (free/fee waiver) ───
  if (/no\s*(?:tuition\s*)?fee|free|fee\s*waiver|exempt/i.test(text) && /sc|st|pwd/i.test(text)) {
    rules.push({ type: "fee_waiver_available", text: "Fee waiver for SC/ST/PwD" });
  }

  // ─── Expand group aliases: if text mentions "SC/ST/OBC", any SC rule also applies to ST, OBC ───
  const aliasGroups = [
    { match: /sc\s*\/\s*st\s*\/?\s*obc/i, aliases: ["sc", "st", "obc"] },
    { match: /sc\s*\/\s*st/i, aliases: ["sc", "st"] },
    { match: /st\s*\/\s*obc/i, aliases: ["st", "obc"] },
    { match: /obc\s*\/\s*ews/i, aliases: ["obc", "ews"] },
  ];
  const hasGroup = aliasGroups.filter((g) => g.match.test(text));
  if (hasGroup.length) {
    for (const group of hasGroup) {
      for (const alias of group.aliases) {
        const source = rules.find(
          (r) => r.type === "category_min" && group.aliases.includes(r.category) && r.category !== alias
        );
        if (source) {
          const exists = rules.some((r) => r.type === "category_min" && r.category === alias && r.value === source.value);
          if (!exists) {
            rules.push({ type: "category_min", category: alias, value: source.value, text: `${alias}: ${source.value}%` });
          }
        }
      }
    }
  }

  // Deduplicate: keep unique (type + value)
  const seen = new Set();
  const unique = rules.filter((r) => {
    const key = `${r.type}|${r.value || r.subjects?.join(",") || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { rules: unique, raw: text };
};

const checkExamMatch = (inst, exam) => {
  if (!exam || !inst.examAccepted) return "unknown";
  const accepted = inst.examAccepted.split(",").map((e) => normText(e.trim()));
  const studentExam = normText(exam);
  const matched = accepted.some((e) => e.includes(studentExam) || studentExam.includes(e));
  return matched ? "accepted" : "unsure";
};

const checkEligibility = (inst, { exam, marks, category }) => {
  const result = {
    _eligible: true,
    _examMatch: "unknown",
    _minMarks: null,
    _eligibilityNote: null,
    _eligibilityRules: []
  };

  // Exam match
  result._examMatch = checkExamMatch(inst, exam);
  if (exam && result._examMatch === "accepted") {
    result._eligibilityRules.push({ type: "exam_accepted", text: `Accepts ${exam}` });
  } else if (exam && result._examMatch === "unsure") {
    result._eligibilityRules.push({ type: "exam_accepted", text: `Exam ${exam} not explicitly listed`, value: 0 });
  }

  // Parse ALL eligibility rules from HTML
  const parsed = parseAllEligibility(inst);
  result._eligibilityRules = [...result._eligibilityRules, ...parsed.rules];

  const m = Number(marks);
  const cat = (category || "general").toLowerCase();

  // Check each rule against student profile
  const failures = [];

  for (const rule of parsed.rules) {
    if (rule.type === "category_min") {
      // If rule matches student's category, check marks
      if (cat === rule.category || (cat === "general" && rule.category === "general")) {
        result._minMarks = rule.value;
        if (m && m < rule.value) {
          failures.push(`${rule.category} requires ${rule.value}% (you have ${m}%)`);
        }
      }
      // Also track lowest general min marks
      if (rule.category === "general" && (!result._minMarks || rule.value < result._minMarks)) {
        result._minMarks = rule.value;
      }
    }

    if (rule.type === "overall_min") {
      if (!result._minMarks || rule.value < result._minMarks) {
        result._minMarks = rule.value;
      }
      if (m && m < rule.value) {
        failures.push(`Minimum ${rule.value}% required (you have ${m}%)`);
      }
    }

    if (rule.type === "subject_min") {
      if (m && m < rule.value) {
        failures.push(`${rule.subjects}: ${rule.value}% required`);
      }
    }

    if (rule.type === "subjects_required") {
      // We can't fully validate this without per-subject marks from student
      result._requiredSubjects = rule.subjects;
    }
  }

  // If no cutoff found in HTML, fallback: check if marks < typical passing (30%)
  if (!parsed.rules.length && m && m < 30) {
    failures.push("Marks too low for most institutes");
  }

  // Determine eligible status
  if (failures.length) {
    result._eligible = false;
    result._eligibilityNote = failures.join("; ");
  } else if (result._minMarks && m && m >= result._minMarks) {
    result._eligible = true;
    result._eligibilityNote = `Meets ${result._minMarks}% requirement`;
  }

  return result;
};

// ── Tier Classification ("Caste System") ───────────────────────────────────
// Each institute gets a quality tier based on all available signals

const classifyTier = (inst) => {
  let score = 0;

  // Best-rated flags (strongest signal)
  if (inst.isBestRatedInstitute) score += 30;
  if (inst.isBestRatedUniversity) score += 30;
  if (inst.isBestRatedCollege) score += 25;

  // Rating (0-5 scale)
  if (inst.rating) score += Number(inst.rating) * 5;

  // Rank (lower is better, e.g. top 10 = 25pts, top 50 = 15pts)
  if (inst.rank) {
    const r = Number(inst.rank);
    if (r <= 10) score += 25;
    else if (r <= 50) score += 18;
    else if (r <= 100) score += 12;
    else if (r <= 500) score += 6;
    else score += 3;
  }

  // Organization type prestige
  if (inst.organisationType === "Central") score += 15;
  else if (inst.organisationType === "State") score += 10;
  else if (inst.organisationType === "Deemed") score += 8;
  else if (inst.organisationType === "Autonomous") score += 6;
  else if (inst.organisationType === "Aided") score += 4;

  // University > College > Institute
  if (inst.organization === "University") score += 10;
  else if (inst.organization === "College") score += 5;

  // Established (older = more reputable, up to 10pts)
  if (inst.establishedYear) {
    const age = new Date().getFullYear() - Number(inst.establishedYear);
    if (age >= 50) score += 10;
    else if (age >= 25) score += 7;
    else if (age >= 10) score += 4;
    else score += 2;
  }

  // Exam acceptance breadth (more exams = larger institution)
  if (inst.examAccepted) {
    const exams = inst.examAccepted.split(",").filter(Boolean).length;
    score += Math.min(exams, 5);
  }

  // Facilities count (proxy for infrastructure investment)
  if (inst.facilities && Array.isArray(inst.facilities)) {
    const fCount = inst.facilities.length;
    if (fCount >= 8) score += 10;
    else if (fCount >= 5) score += 7;
    else if (fCount >= 3) score += 4;
    else if (fCount >= 1) score += 2;
  }

  // Gallery images (more = better invested)
  if (inst.gallery && Array.isArray(inst.gallery)) {
    const gCount = inst.gallery.length;
    if (gCount >= 10) score += 5;
    else if (gCount >= 5) score += 3;
    else score += 1;
  }

  // About content length as completeness signal
  if (inst.about && typeof inst.about === "string" && inst.about.length > 200) score += 5;

  // Highest package (prestige signal for placement)
  if (inst.highestPackage) {
    const hp = Number(inst.highestPackage);
    if (hp >= 5000000) score += 10;  // 50L+
    else if (hp >= 1000000) score += 7;
    else if (hp >= 500000) score += 4;
    else score += 2;
  }

  // Affiliation with known university
  if (inst.affiliation) score += 3;

  // Determine tier from total score
  if (score >= 60) return { tier: "platinum", tierLabel: "Premium", tierScore: score };
  if (score >= 35) return { tier: "gold", tierLabel: "Standard", tierScore: score };
  if (score >= 18) return { tier: "silver", tierLabel: "Value", tierScore: score };
  return { tier: "bronze", tierLabel: "Accessible", tierScore: score };
};

// ── Multi-Dimensional Institute Scoring ────────────────────────────────────

const scoreInstitute = (inst, { marks, exam, preferredCourse, budget, state, city, category }) => {
  const tier = classifyTier(inst);
  let dims = { reputation: 0, affordability: 0, infrastructure: 0, location: 0 };

  // ── Eligibility Check ──
  const elig = checkEligibility(inst, { exam, marks, category });

  // ── Dimension 1: Academic Reputation (0-100) ──
  if (inst.isBestRatedInstitute || inst.isBestRatedUniversity || inst.isBestRatedCollege) dims.reputation += 30;
  if (inst.rating) dims.reputation += Math.min(Number(inst.rating) * 12, 30);
  if (inst.rank) {
    const r = Number(inst.rank);
    if (r <= 10) dims.reputation += 25;
    else if (r <= 50) dims.reputation += 18;
    else if (r <= 100) dims.reputation += 12;
    else dims.reputation += 5;
  }
  if (inst.organisationType === "Central" || inst.organisationType === "State") dims.reputation += 10;
  if (inst.organization === "University") dims.reputation += 5;
  if (inst.establishedYear) {
    const age = new Date().getFullYear() - Number(inst.establishedYear);
    dims.reputation += Math.min(age / 5, 10);
  }
  if (inst.affiliation) dims.reputation += 5;
  dims.reputation = Math.min(dims.reputation, 100);

  // ── Dimension 2: Affordability vs Budget (0-100) ──
  const b = Number(budget);
  if (b && getInstFee(inst) > 0) {
    const fee = getInstFee(inst);
    if (fee <= b) {
      dims.affordability = 70 + Math.max(0, ((b - fee) / b) * 30);
    } else if (fee <= b * 1.3) {
      dims.affordability = 50 - ((fee - b) / (b * 0.3)) * 20;
    } else if (fee <= b * 2) {
      dims.affordability = 30 - ((fee - b * 1.3) / (b * 0.7)) * 20;
    } else {
      dims.affordability = Math.max(5, 30 - ((fee - b * 2) / (b * 5)) * 25);
    }
  } else if (b && getInstFee(inst) === 0) {
    dims.affordability = 80;
  } else {
    dims.affordability = 50;
  }
  if (inst.scholarshipInfo) dims.affordability += 5;

  // ── Dimension 3: Infrastructure & Facilities (0-100) ──
  if (inst.facilities && Array.isArray(inst.facilities)) {
    dims.infrastructure += Math.min(inst.facilities.length * 8, 40);
  }
  if (inst.gallery && Array.isArray(inst.gallery)) {
    dims.infrastructure += Math.min(inst.gallery.length * 3, 20);
  }
  if (inst.library) dims.infrastructure += 10;
  if (inst.sports) dims.infrastructure += 8;
  if (inst.hostel) dims.infrastructure += 10;
  if (inst.about && inst.about.length > 100) dims.infrastructure += 7;
  if (inst.highestPackage) dims.infrastructure += 5;
  dims.infrastructure = Math.min(dims.infrastructure, 100);

  // ── Dimension 4: Location Match (0-100) ──
  if (city && inst.city) {
    if (inst.city.toLowerCase() === city.toLowerCase()) dims.location = 100;
    else if (inst.city.toLowerCase().includes(city.toLowerCase()) ||
      city.toLowerCase().includes(inst.city.toLowerCase())) dims.location = 75;
    else if (state && inst.state) {
      if (inst.state.toLowerCase() === state.toLowerCase()) dims.location = 55;
      else dims.location = 20;
    } else dims.location = 30;
  } else if (state && inst.state) {
    if (inst.state.toLowerCase() === state.toLowerCase()) dims.location = 65;
    else dims.location = 20;
  } else {
    dims.location = 30;
  }

  // ── Course/Stream Match (bonus to overall) ──
  let courseMatch = 0;
  if (preferredCourse) {
    const pref = normText(preferredCourse);
    const haystack = [inst.instituteName, inst.streams, inst.specialization, inst.courseTitle]
      .filter(Boolean).join(" ");
    const h = normText(haystack);
    if (h.includes(pref)) courseMatch = 15;
    else if (pref.split(/\s+/).some((w) => h.includes(w))) courseMatch = 8;
  }

  // ── Composite Score (weighted) ──
  const composite =
    dims.reputation * 0.35 +
    dims.affordability * 0.25 +
    dims.infrastructure * 0.20 +
    dims.location * 0.20 +
    courseMatch;

  return {
    ...inst,
    _tier: tier.tier,
    _tierLabel: tier.tierLabel,
    _tierScore: tier.tierScore,
    _reputation: Math.round(dims.reputation),
    _affordability: Math.round(dims.affordability),
    _infrastructure: Math.round(dims.infrastructure),
    _location: Math.round(dims.location),
    _courseMatch: courseMatch,
    _score: Math.round(composite * 10) / 10,
    _eligible: elig._eligible,
    _examMatch: elig._examMatch,
    _minMarks: elig._minMarks,
    _eligibilityNote: elig._eligibilityNote,
    _eligibilityRules: elig._eligibilityRules,
    _requiredSubjects: elig._requiredSubjects
  };
};

export const getNearbyInstitutes = async ({ state, city, budget, exam, marks, category } = {}) => {
  try {
    const institutes = await fetchInstitutes({ state, city });
    let filtered = applyBudgetFilter(institutes, budget);
    return filtered
      .map((i) => ({
        ...i,
        ...checkEligibility(i, { exam, marks, category }),
        _tier: classifyTier(i).tier,
        _tierLabel: classifyTier(i).tierLabel,
        _match: city && i.city?.toLowerCase() === city.toLowerCase() ? "same_city" :
          state && i.state?.toLowerCase() === state.toLowerCase() ? "same_state" : "other",
        _score: city && i.city?.toLowerCase() === city.toLowerCase() ? 100 :
          state && i.state?.toLowerCase() === state.toLowerCase() ? 70 : 40
      }))
      .sort((a, b) => {
        if (a._match !== b._match) return a._match === "same_city" ? -1 : a._match === "same_state" ? -1 : 1;
        return (classifyTier(b).tierScore) - (classifyTier(a).tierScore);
      })
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching nearby institutes:", error);
    return [];
  }
};

export const getRecommendedInstitutes = async ({
  marks, exam, preferredCourse, budget, state, city, category
} = {}) => {
  try {
    let institutes = await fetchInstitutes({ state, city });
    institutes = applyBudgetFilter(institutes, budget);

    let scored = institutes.map((inst) =>
      scoreInstitute(inst, { marks, exam, preferredCourse, budget, state, city, category })
    );

    // Push ineligible institutes to the bottom but DON'T remove them
    // (user may still want to see them with the "Check Eligibility" warning)
    scored.sort((a, b) => {
      if (a._eligible !== b._eligible) return a._eligible ? -1 : 1;
      return b._score - a._score;
    });

    return scored.slice(0, 15);
  } catch (error) {
    console.error("Error fetching recommended institutes:", error);
    return [];
  }
};

// ── Shared Helpers ─────────────────────────────────────────────────────────

const fetchInstitutes = async ({ state, city } = {}) => {
  const results = [];

  if (city) {
    const cRes = await axiosInstance.get(`/institutes`, {
      params: { limit: 30, searchFields: JSON.stringify({ city, ...(state ? { state } : {}) }) }
    });
    results.push(...(normalize(cRes)?.result || []));
  }

  if (state) {
    const sRes = await axiosInstance.get(`/institutes`, {
      params: { limit: 30, searchFields: JSON.stringify({ state }) }
    });
    for (const i of (normalize(sRes)?.result || [])) {
      if (!results.some((r) => r._id === i._id)) results.push(i);
    }
  }

  if (!results.length) {
    const aRes = await axiosInstance.get(`/institutes`, {
      params: { limit: 30, sort: JSON.stringify({ createdAt: 'desc' }) }
    });
    results.push(...(normalize(aRes)?.result || []));
  }

  return results;
};

const applyBudgetFilter = (list, budget) => {
  if (!budget) return list;
  const b = Number(budget);
  if (!b) return list;
  const affordable = list.filter((i) => getInstFee(i) <= b * 1.1);
  return affordable.length >= 3 ? affordable : list;
};

// ── Course Recommendations ──────────────────────────────────────────────────

export const getRecommendedCourses = async ({
  marks, preferredCourse, budget, state, city
} = {}) => {
  try {
    const filters = {};
    if (preferredCourse) filters.courseTitle = { $regex: preferredCourse, $options: 'i' };
    if (marks) filters.cutOff = { $lte: marks };

    const response = await axiosInstance.get(`/courses`, {
      params: {
        limit: 50,
        sort: JSON.stringify({ createdAt: 'desc' }),
        filters: JSON.stringify(filters)
      }
    });
    let courses = normalize(response)?.result || [];

    const budgetVal = Number(budget);
    if (budgetVal) {
      courses = courses.filter((c) => !c.coursePrice || Number(c.coursePrice) <= budgetVal * 1.2);
    }

    return courses
      .map((c) => {
        let score = 0;
        const m = Number(marks);
        if (m && c.cutOff) {
          const co = Number(c.cutOff);
          if (m >= co) score += 50;
          else score += Math.max(0, (m / co) * 20);
        } else score += 25;

        if (budgetVal && c.coursePrice) {
          const p = Number(c.coursePrice);
          if (p <= budgetVal) score += 30;
          else score += Math.max(0, (budgetVal / p) * 10);
        } else score += 15;

        if (preferredCourse && c.courseTitle) {
          if (normText(c.courseTitle).includes(normText(preferredCourse))) score += 20;
        }

        return { ...c, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    return [];
  }
};

// ── Nearby Counselors ───────────────────────────────────────────────────────

export const getNearbyCounselors = async ({ state, city, preferredCourse } = {}) => {
  try {
    const filters = {};
    if (city) filters.city = city;
    if (state) filters.state = state;

    const response = await axiosInstance.get(`/counselors`, {
      params: { limit: 50, filters: JSON.stringify(filters) }
    });
    const counselors = normalize(response)?.result || [];

    return counselors
      .map((c) => {
        let score = 0;
        if (city && c.city?.toLowerCase() === city.toLowerCase()) score += 50;
        else if (state && c.state?.toLowerCase() === state.toLowerCase()) score += 30;
        if (preferredCourse && c.category) {
          if (normText(c.category).includes(normText(preferredCourse))) score += 20;
        }
        if (c.ExperienceYear) score += Math.min(Number(c.ExperienceYear), 10);
        return { ...c, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching nearby counselors:", error);
    return [];
  }
};

export const getAllStreams = async () => {
  try {
    const response = await axios.get(`${baseURL}/streams?limit=100&sort={"createdAt":"asc"}`);
    return response.data?.data?.result || [];
  } catch (error) {
    console.error("Error fetching all streams:", error);
    return [];
  }
};

// ── Unified Recommendation ──────────────────────────────────────────────────

export const getFilteredRecommendations = async (profile) => {
  const [courses, institutes, counselors] = await Promise.all([
    getRecommendedCourses(profile),
    getRecommendedInstitutes(profile),
    getNearbyCounselors(profile)
  ]);
  return { courses, institutes, counselors, _eligibilityChecked: true };
};

// ── Quick Nearby (just institutes, dead simple) ──────────────────────────────

export const quickNearby = async ({ state, city, budget, exam, marks, category } = {}) => {
  if (!state && !city) return [];
  return getNearbyInstitutes({ state, city, budget, exam, marks, category });
};

// ── Q&A Like / Vote ───────────────────────────────────────────────────────────

const authHeaders = () => ({
  "x-access-token": localStorage.getItem("accessToken") || "",
  "x-refresh-token": localStorage.getItem("refreshToken") || "",
});

export const likeQuestion = async (questionId, type) => {
  const res = await axiosInstance.post(
    `/question-answer/${questionId}/like`,
    { type },
    { headers: authHeaders() }
  );
  return res.data;
};

export const likeAnswer = async (questionId, answerId, type, answeredBy) => {
  const res = await axiosInstance.post(
    `/question-answer/${questionId}/answer/${answerId}/like`,
    { type, answeredBy },
    { headers: authHeaders() }
  );
  return res.data;
};
