import React, { Suspense } from 'react';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ScrollToTop from './Utilities/ScrollToTop';
import Loader from './Components/Loader';
import BecomeCouseller from './Pages/BecomeCouseller';
import Counselling from './Pages/counselling';

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
const Writereview = React.lazy(() => import('./Pages/Writereview'));
const Login = React.lazy(() => import('./Pages/Login'));
const Signup = React.lazy(() => import('./Pages/Signup'));
const Forgotpassword = React.lazy(() => import('./Pages/Forgotpassword'));
const counselling = React.lazy(() => import('./Pages/counselling'));




const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/institute/:id" element={<Instituepage />} />
          <Route path="/searchpage" element={<SearchPage />} />
          <Route path="/coursesinfopage/:id" element={<Coursesinfopage />} />
          <Route path="/blogpage" element={<Blogpage />} />
          <Route path="/contactuspage" element={<Contactuspage />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/counselingpage" element={<Counselingpage />} />
          <Route path="/questionandAnswer/:email" element={<QuestionandAnswer />} />
          <Route path="/counselling/:email" element={<Counselling />} />
          <Route path="/careerspage" element={<Careerspage />} />
          <Route path="/detailpage" element={<Detailpage />} />
          <Route path="/writereview" element={<Writereview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/become-couseller" element={<BecomeCouseller />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
