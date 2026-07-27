const MAX_QUESTIONS = 10;
const STORAGE_KEY = 'edu_question_count';

const EDUCATION_KEYWORDS = [
  'course', 'college', 'university', 'exam', 'admission', 'fee', 'fees',
  'career', 'job', 'placement', 'scholarship', 'study', 'degree', 'diploma',
  'student', 'teacher', 'professor', 'lecture', 'class', 'subject', 'syllabus',
  'curriculum', 'internship', 'training', 'skill', 'learn',
  'education', 'school', 'institute', 'academy', 'coaching', 'tutor',
  'rank', 'percentile', 'score', 'marks', 'grade', 'cgpa', 'gpa',
  'science', 'arts', 'commerce', 'engineering', 'medical', 'management',
  'btech', 'mtech', 'bsc', 'msc', 'bba', 'mba', 'bca', 'mca', 'ba', 'ma',
  'phd', 'doctorate', 'research', 'thesis',
  'personality', 'assessment', 'career fit', 'college fit',
  'hostel', 'campus', 'library', 'lab', 'facility',
  'distance', 'online', 'correspondence',
  'government', 'private', 'aided', 'autonomous',
  'counseling', 'guidance', 'entrance',
  'semester', 'loan', 'education loan',
  'review', 'ranking', 'accreditation', 'approval', 'recognition',
  'assignment', 'project', 'practical', 'workshop',
  'certification', 'certificate', 'vocational',
  'package', 'salary', 'recruiter', 'company',
  'igcse', 'cbse', 'icse', 'state board', 'ncert', 'ugc', 'aicte',
  'cat', 'gate', 'neet', 'jee', 'sat', 'gre', 'gmat', 'ielts', 'toefl',
  'teacher', 'teaching', 'faculty', 'principal', 'director',
  'sport', 'sports', 'cultural', 'fest', 'event',
  'transport', 'bus', 'canteen', 'food', 'mess',
  'percentage', 'aggregate', 'cutoff', 'cut off', 'merit',
  'govt', 'private', 'deemed', 'central', 'state university',
  '春季', 'admission open', 'apply', 'registration', 'enroll',
  'what', 'how', 'why', 'which', 'when', 'where', 'can', 'tell', 'explain',
  'suggest', 'recommend', 'guide', 'help', 'difference', 'compare',
  'scope', 'future', 'opportunity', 'salary', 'income',
  'best', 'top', 'good', 'great', 'excellent', 'affordable',
  'syllabus', 'curriculum', 'subject', 'topic', 'lesson',
  'online class', 'virtual', 'remote learning', 'distance education',
  'backlog', 'supply', 're exam', 'retake', 'improvement',
  'transfer', 'migration', 'change course', 'switch',
  'academic', 'educational', 'learning', 'knowledge',
  'book', 'study material', 'notes', 'resource', 'reference',
  'time table', 'schedule', 'routine', 'academic calendar',
  'intern', 'fellowship', 'apprenticeship', 'trainee',
  'abroad', 'foreign', 'international', 'overseas', 'visa',
  'loan', 'financial aid', 'assistance', 'support',
];

const GREETINGS = [
  'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
  'thanks', 'thank you', 'thanku', 'thx', 'bye', 'goodbye', 'ok', 'okay',
  'sure', 'great', 'nice', 'awesome', 'cool', 'yes', 'no', 'namaste',
  'hii', 'hii', 'helloo', 'hellooo', 'hey there',
];

export function isEducationRelated(text) {
  const t = text.toLowerCase().trim();
  const isGreeting = GREETINGS.some(
    (g) => t === g || t.startsWith(g + ' ') || t.startsWith(g + ',') || t.startsWith(g + '!') || t.startsWith(g + '.')
  );
  if (isGreeting) return true;
  return EDUCATION_KEYWORDS.some((kw) => t.includes(kw));
}

export function getQuestionCount() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function incrementQuestionCount() {
  try {
    const count = getQuestionCount() + 1;
    localStorage.setItem(STORAGE_KEY, String(count));
    return count;
  } catch {
    return getQuestionCount();
  }
}

export function resetQuestionCount() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { }
}

const MESSAGES = {
  en: {
    notEducation: "I'm here to help with education-related questions only. Please ask me about courses, colleges, careers, exams, or anything related to your academic journey.",
    limitReached: "You have reached the maximum of 10 questions. Please log in and drop your question in the QA section where our experts will answer you.",
  },
  hi: {
    notEducation: "मैं केवल शिक्षा से संबंधित प्रश्नों में सहायता के लिए हूँ। कृपया मुझसे कोर्स, कॉलेज, करियर, परीक्षा या आपकी शैक्षणिक यात्रा से जुड़ी किसी भी चीज़ के बारे में पूछें।",
    limitReached: "आप अधिकतम 10 प्रश्नों की सीमा तक पहुँच चुके हैं। कृपया लॉगिन करें और QA सेक्शन में अपना प्रश्न पूछें, हमारे विशेषज्ञ आपको उत्तर देंगे।",
  },
};

export function getMessage(key, language) {
  const lang = MESSAGES[language] ? language : 'en';
  return MESSAGES[lang][key] || MESSAGES.en[key];
}

export function isAssessmentActive(messages) {
  if (!messages || messages.length === 0) return false;
  const last = messages[messages.length - 1];
  if (last.role !== 'assistant') return false;
  return /\bQuestion\s+\d+/i.test(last.content);
}

export { MAX_QUESTIONS };
