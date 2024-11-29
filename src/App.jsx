import React from 'react'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './Pages/Homepage';
import Footer from './Components/Footer';
import PageNotFound from './Pages/PageNotFound';
import ScrollToTop from './Utilities/ScrollToTop';
import Instituepage from './Pages/Instituepage';
import SearchPage from './Pages/SearchPage';
import Coursesinfopage from './Pages/Coursesinfopage';
import Blogpage from './Pages/Blogpage';
import Contactuspage from './Pages/Contactuspage';
import Aboutus from './Pages/Aboutus';
import Counselingpage from './Pages/Counselingpage';
import QuestionandAnswer from './Pages/QuestionandAnswer';
import Careerspage from './Pages/Careerspage';
import Detailpage from './Pages/Detailpage';
import Writereview from './Pages/Writereview';

const App = () => {
  return (
    <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
    >
      <ScrollToTop/>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='*' element={<PageNotFound/>} />
          <Route path='/institute' element={<Instituepage/>} />
          <Route path='/searchpage' element={<SearchPage/>} />
          <Route path='/coursesinfopage' element={<Coursesinfopage/>} />
          <Route path='/blogpage' element={<Blogpage/>} />
          <Route path='/contactuspage' element={<Contactuspage/>} />
          <Route path='/aboutus' element={<Aboutus/>} />
          <Route path='/counselingpage' element={<Counselingpage/>} />
          <Route path='/questionandAnswer' element={<QuestionandAnswer/>} />
          <Route path='/careerspage' element={<Careerspage/>} />
          <Route path='/detailpage' element={<Detailpage/>} />
          <Route path='/writereview' element={<Writereview/>} />
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default App