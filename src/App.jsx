import React, { Suspense, useEffect, useMemo } from 'react';
import { Route, Routes, BrowserRouter, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Utilities/ScrollToTop';
import Loader from './Components/Loader';
import BecomeCouseller from './Pages/BecomeCouseller';
import AuthRoute from './AuthRoute';

import Counselling from './Pages/counselling';

import DashboardLayout from './Layout/DashboardLayout';
import Dashboard from './Pages/Dashboard';
import ProfilePage from './Pages/ProfilePage';
import StudentDocument from './Pages/StudentDocument';
import CounselorListPage from './Pages/CounselorListPage';
import SettingsPage from './Pages/SettingsPage';
import { ToastContainer } from 'react-toastify';
import ReferAndEarn from './Pages/Refer-and-earn';
import ReviewActivity from './Pages/ReviewActivity';
import PopularCourses from './Pages/PopularCoursePage';
import BestRatedInstitute from './Pages/Best-Rated-Institute';
import TrendingInstitute from './Pages/TrendingInstitute';
import Counselor from './Pages/Counselor';
import NewsDetail from './Pages/NewsDetail';
import ScheduledSlots from './Pages/ScheduledSlots';
import Payout from './Pages/Payout';
import NewsPage from './Pages/NewsPage';
import TrendingStreams from './Components/trendingStreampage';
import TrendingCourses from './Pages/TrendingCoursespage';
import TermsAndConditions from './Pages/TermsAndConditions ';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
const WebinarsPage = React.lazy(() => import('./Pages/WebinarsPage'));
// Lazy-loaded components
const Homepage = React.lazy(() => import('./Pages/Homepage'));
const PageNotFound = React.lazy(() => import('./Pages/PageNotFound'));
const Instituepage = React.lazy(() => import('./Pages/Instituepage'));
const SearchPage = React.lazy(() => import('./Pages/SearchPage'));
const Coursesinfopage = React.lazy(() => import('./Pages/Coursesinfopage'));
const Blogpage = React.lazy(() => import('./Pages/Blogpage'));
const Contactuspage = React.lazy(() => import('./Pages/Contactuspage'));
const Aboutus = React.lazy(() => import('./Pages/Aboutus'));
const Counselingpage = React.lazy(() => import('./Pages/Counselingpage'));
const QuestionandAnswer = React.lazy(() => import('./Pages/QuestionandAnswer'));
const Careerspage = React.lazy(() => import('./Pages/Careerspage'));
const Policy = React.lazy(() => import('./Pages/Policy'));
const Detailpage = React.lazy(() => import('./Pages/Detailpage'));
const BlogDetailPage = React.lazy(() => import('./Pages/BlogDetailPage'));
const Writereview = React.lazy(() => import('./Pages/Writereview'));
const Forgotpassword = React.lazy(() => import('./Pages/Forgotpassword'));
// const counselling = React.lazy(() => import('./Pages/counselling'));
const Wishlist = React.lazy(() => import('./Pages/Wishlist'));
const Question = React.lazy(() => import('./Pages/Question-Answer'))
const Redeem = React.lazy(() => import('./Pages/Redeem'))
const Logout = React.lazy(() => import('./Pages/Logout'))

const CounselorTestPayment = React.lazy(() => import('./Pages/CounselorTest/Payment'));
const CounselorTestExam = React.lazy(() => import('./Pages/CounselorTest/TestExam'));
const CounselorTestResult = React.lazy(() => import('./Pages/CounselorTest/TestResult'));

const LegacyCounselorResultRedirect = () => {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'));
  return (
    <Navigate
      to={isAuthenticated ? '/dashboard/test-result' : '/login'}
      replace
    />
  );
};

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authPopupRoutes = ['/login', '/signup'];
  const noFooterRoutes = ['/login', '/signup', '/writereview'];
  const isAuthPopupRoute = authPopupRoutes.includes(location.pathname);
  const shouldHideFooter = noFooterRoutes.includes(location.pathname);
  const stateBackgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    if (!isAuthPopupRoute) {
      sessionStorage.setItem(
        'authBackgroundPath',
        `${location.pathname}${location.search}${location.hash}`
      );
    }
  }, [isAuthPopupRoute, location.pathname, location.search, location.hash]);

  const storedBackgroundLocation = useMemo(() => {
    const storedPath = sessionStorage.getItem('authBackgroundPath');
    if (!storedPath) return null;

    const hashIndex = storedPath.indexOf('#');
    const queryIndex = storedPath.indexOf('?');

    const pathnameEndIndex =
      queryIndex === -1
        ? hashIndex === -1
          ? storedPath.length
          : hashIndex
        : hashIndex === -1
          ? queryIndex
          : Math.min(queryIndex, hashIndex);

    const pathname = storedPath.slice(0, pathnameEndIndex) || '/';
    const search = queryIndex === -1 ? '' : storedPath.slice(queryIndex, hashIndex === -1 ? undefined : hashIndex);
    const hash = hashIndex === -1 ? '' : storedPath.slice(hashIndex);

    return { pathname, search, hash };
  }, [isAuthPopupRoute]);

  const fallbackBackgroundLocation = isAuthPopupRoute ? { pathname: '/' } : null;
  const backgroundLocation =
    stateBackgroundLocation || storedBackgroundLocation || fallbackBackgroundLocation;
  const shouldRenderAuthModal = isAuthPopupRoute && Boolean(backgroundLocation);
  const displayLocation = shouldRenderAuthModal ? backgroundLocation : location;
  const isDisplayAuthRoute = authPopupRoutes.includes(displayLocation.pathname);

  const handleCloseAuthModal = () => {
    if (stateBackgroundLocation) {
      navigate(-1);
      return;
    }

    const storedPath = sessionStorage.getItem('authBackgroundPath');
    navigate(storedPath || '/', { replace: true });
  };

  const handleSwitchAuthModal = (targetRoute) => {
    navigate(targetRoute, {
      replace: true,
      state: { backgroundLocation: backgroundLocation || displayLocation },
    });
  };

  return (
    <>
      {!isDisplayAuthRoute && <Navbar />}
      <Suspense fallback={<Loader />}>
        <Routes location={displayLocation}>
          {/* Existing Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/institute/:id" element={<Instituepage />} />
          <Route path="/institute/:slug" element={<Instituepage />} />
          <Route path='/trendingCourses' element={<TrendingCourses></TrendingCourses>}></Route>
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/coursesinfopage/:id" element={<Coursesinfopage />} />
          <Route path="/coursesinfopage/:slug" element={<Coursesinfopage />} />
          <Route path='/trending-stream' element={<TrendingStreams />}></Route>
          <Route path="/blogpage" element={<Blogpage />} />
          <Route path="/contactuspage" element={<Contactuspage />} />
          <Route path="/popularcourses" element={<PopularCourses />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/counselingpage" element={<Counselingpage />} />
          <Route path="/questionandAnswer/:email" element={<QuestionandAnswer />} />
          <Route path='/question-&-answers' element={<Question />}></Route>
          <Route path="/counselling/:email" element={<Counselling />} />
          <Route path="/careerspage" element={<Careerspage />} />
          <Route path="/blogdetailpage/:id" element={<BlogDetailPage />} />
          <Route path="/blogdetailpage/:slug" element={<BlogDetailPage />} />
          <Route path="/detailpage/:id" element={<Detailpage />} />
          <Route path="/detailpage/:slug" element={<Detailpage />} />

          <Route path="/webinars" element={<WebinarsPage />} />

          <Route path="/writereview" element={<Writereview />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms-&-conditions" element={<TermsAndConditions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/become-couseller" element={<BecomeCouseller />} />
          <Route path="/institute" element={<BestRatedInstitute />} />
          <Route path="/institute:slug" element={<BestRatedInstitute />} />

          <Route path="/trending-institute" element={<TrendingInstitute />} />
          <Route path='/counselor' element={<Counselor />}></Route>
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/news/:slug" element={<NewsDetail />} />

          <Route path="/news" element={<NewsPage />} />
          <Route path='/blog/:slug' element={<BlogDetailPage />}></Route>

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <AuthRoute>
                <DashboardLayout />
              </AuthRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile-page" element={<ProfilePage />} />
            <Route path="documents" element={<StudentDocument />} />
            <Route path="counselor" element={<CounselorListPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="slots" element={<ScheduledSlots />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path='reviews' element={<ReviewActivity />}></Route>
            <Route path="redeem" element={<Redeem />} />
            <Route path='payout' element={<Payout />} />

            {/* Dashboard webinars list */}
            <Route path="webinar" element={<WebinarsPage />} />
            <Route path="test-result" element={<CounselorTestResult />} />

            < Route path='refer&earn' element={<ReferAndEarn></ReferAndEarn>}></Route>
            <Route path="logout" element={<Logout />} />

          </Route>
          <Route path="/counselor-test/payment" element={<CounselorTestPayment />} />
          <Route path="/counselor-test/exam" element={<CounselorTestExam />} />
          <Route path="/counselor-test/result" element={<LegacyCounselorResultRedirect />} />
        </Routes>
      </Suspense>

      {shouldRenderAuthModal && (
        <div className="fixed inset-0 z-[10000] bg-black/45 p-3 sm:p-6 flex items-start sm:items-center justify-center overflow-y-auto">
          <div className="w-full max-w-md my-6 sm:my-10">
            {location.pathname === '/login' ? (
              <Login
                isMode="popup"
                onClose={handleCloseAuthModal}
                onSwitch={() => handleSwitchAuthModal('/signup')}
              />
            ) : (
              <Signup
                isMode="popup"
                onClose={handleCloseAuthModal}
                onSwitch={() => handleSwitchAuthModal('/login')}
              />
            )}
          </div>
        </div>
      )}

      {!shouldHideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }}
      />
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
