import React, { Suspense } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
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
const Detailpage = React.lazy(() => import('./Pages/Detailpage'));
const BlogDetailPage= React.lazy(() => import('./Pages/BlogDetailPage'));
const Writereview = React.lazy(() => import('./Pages/Writereview'));
const Login = React.lazy(() => import('./Pages/Login'));
const Signup = React.lazy(() => import('./Pages/Signup'));
const Forgotpassword = React.lazy(() => import('./Pages/Forgotpassword'));
const counselling = React.lazy(() => import('./Pages/counselling'));
const Wishlist = React.lazy(() => import('./Pages/Wishlist'));
const Question=React.lazy(()=>import('./Pages/Question-Answer'))
const Redeem = React.lazy(()=> import('./Pages/Redeem'))
const Logout = React.lazy(()=> import('./Pages/Logout'))
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/institute/:id" element={<Instituepage />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/coursesinfopage/:id" element={<Coursesinfopage />} />
          <Route path="/blogpage" element={<Blogpage />} />
          <Route path="/contactuspage" element={<Contactuspage />} />
          <Route path="/popularcourses" element={<PopularCourses />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/counselingpage" element={<Counselingpage />} />
          <Route path="/questionandAnswer/:email" element={<QuestionandAnswer />} />
          <Route path='/question-&-answers' element={<Question/>}></Route>
          <Route path="/counselling/:email" element={<Counselling />} />
          <Route path="/careerspage" element={<Careerspage />} />
          <Route path="/blogdetailpage/:id" element={<BlogDetailPage />} />
          <Route path="/detailpage/:id" element={<Detailpage />} />
          <Route path="/writereview" element={<Writereview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/become-couseller" element={<BecomeCouseller />} />
          <Route path="/institute" element={<BestRatedInstitute/>} />
          <Route path="/trending-institute" element={<TrendingInstitute/>} />

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
            <Route path="wishlist" element={<Wishlist/>} />
            <Route path='reviews' element={<ReviewActivity/>}></Route>
            <Route path="redeem" element={<Redeem/>} />
            < Route path='refer&earn' element={<ReferAndEarn></ReferAndEarn>}></Route>
            <Route path="logout" element={<Logout/>} />

          </Route>
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
