import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ initialTab = 'login', onClose, setAuthTab }) => {
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [showCounsellorPayPopup, setShowCounsellorPayPopup] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', phoneNo: '', role: 'student', password: '' });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.id]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.id]: e.target.value });

  const openOAuth = (provider) => {
    try {
      const url = `${apiUrl}/auth/${provider}`;
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      console.error('OAuth open error', e);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/login`, { ...loginData, isStudent: true });
      const data = res.data;
      if (data?.data) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('userId', data?.data?.user?._id || '');
        localStorage.setItem('role', data?.data?.user?.role || '');
        localStorage.setItem('email', data?.data?.user?.email || '');
        toast.success('Logged in successfully');

        // close modal
        onClose && onClose();

        // role-based handling: redirect admins to admin portal when applicable
        const role = data?.data?.user?.role;
        if (role && role !== 'student') {
          if (role === 'admin' || role === 'superadmin') {
            window.location.href = 'https://admin.eduroutez.com/';
            return;
          }
          // for other non-student roles, continue with normal redirect flow
        }

        // redirect if needed
        const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
        const pendingWebinarLink = sessionStorage.getItem('pendingWebinarLink');
        if (pendingWebinarLink) {
          sessionStorage.removeItem('pendingWebinarLink');
          window.open(pendingWebinarLink, '_blank');
          navigate('/');
        } else if (redirectAfterLogin) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectAfterLogin);
        } else {
          navigate('/');
        }
      } else {
        throw new Error(data?.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: signupData.name,
        email: signupData.email,
        phoneNo: signupData.phoneNo,
        role: signupData.role,
        password: signupData.password,
      };
      const res = await axios.post(`${apiUrl}/signup`, payload);
      const data = res.data;
      if (data?.success) {
        toast.success('Signup successful.');
        // If user signed up as counsellor, prompt to pay to become verified
        if ((signupData.role || payload.role) === 'counsellor') {
          setShowCounsellorPayPopup(true);
        } else {
          toast.info('Please verify your email and then log in.');
          setTab('login');
          setAuthTab && setAuthTab('login');
        }
      } else {
        throw new Error(data?.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab('login'); setAuthTab && setAuthTab('login'); }}
          className={`px-4 py-2 rounded-md ${tab === 'login' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          Login
        </button>
        <button
          onClick={() => { setTab('signup'); setAuthTab && setAuthTab('signup'); }}
          className={`px-4 py-2 rounded-md ${tab === 'signup' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          Sign up
        </button>
      </div>

      {tab === 'login' ? (
        <form onSubmit={onLogin} className="space-y-3">
          <input id="email" type="email" value={loginData.email} onChange={handleLoginChange} required placeholder="Email" className="w-full px-3 py-2 border rounded" />
          <input id="password" type="password" value={loginData.password} onChange={handleLoginChange} required placeholder="Password" className="w-full px-3 py-2 border rounded" />
          <div className="flex items-center justify-between">
            <label className="text-sm"><input type="checkbox" className="mr-2" /> Remember</label>
            <button type="button" className="text-sm text-blue-600" onClick={() => navigate('/forgotpassword')}>Forgot?</button>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white px-4 py-2 rounded">{loading ? 'Logging...' : 'Log in'}</button>
            <button type="button" onClick={onClose} className="flex-1 border px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <form onSubmit={onSignup} className="space-y-3">
            <input id="name" type="text" value={signupData.name} onChange={handleSignupChange} required placeholder="Name" className="w-full px-3 py-2 border rounded" />
            <input id="phoneNo" type="tel" value={signupData.phoneNo} onChange={handleSignupChange} required placeholder="Contact number" className="w-full px-3 py-2 border rounded" />
            <input id="email" type="email" value={signupData.email} onChange={handleSignupChange} required placeholder="Email ID" className="w-full px-3 py-2 border rounded" />
            <input id="password" type="password" value={signupData.password} onChange={handleSignupChange} required placeholder="Password" className="w-full px-3 py-2 border rounded" />

            <div className="flex gap-2 items-center">
              <label className="text-sm w-32">Who are you?</label>
              <select id="role" value={signupData.role} onChange={handleSignupChange} className="flex-1 px-3 py-2 border rounded">
                <option value="student">Student</option>
                <option value="counsellor">Counsellor</option>
                <option value="college">College</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-red-600 text-white px-4 py-2 rounded">{loading ? 'Signing...' : 'Sign up'}</button>
              <button type="button" onClick={onClose} className="flex-1 border px-4 py-2 rounded">Cancel</button>
            </div>
          </form>

          <div className="my-3 text-center text-sm text-gray-500">Or sign up using</div>
          <div className="flex gap-3">
            <button onClick={() => openOAuth('google')} className="flex-1 px-4 py-2 border rounded bg-white hover:bg-gray-50">Sign up with Google</button>
            <button onClick={() => openOAuth('facebook')} className="flex-1 px-4 py-2 border rounded bg-white hover:bg-gray-50">Sign up with Facebook</button>
          </div>
        </div>
      )}

      {/* Counsellor payment popup */}
      {showCounsellorPayPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => { setShowCounsellorPayPopup(false); setTab('login'); setAuthTab && setAuthTab('login'); }}></div>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl w-full max-w-md z-[2100]">
            <h3 className="text-lg font-semibold mb-2">Complete verification</h3>
            <p className="text-sm text-gray-600 mb-4">To become a verified counsellor you need to complete a small verification payment. Would you like to pay now?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowCounsellorPayPopup(false); setTab('login'); setAuthTab && setAuthTab('login'); }} className="px-4 py-2 rounded border">Later</button>
              <button onClick={() => { setShowCounsellorPayPopup(false); sessionStorage.setItem('pendingApplication','counsellor'); navigate('/counselor-test/payment'); }} className="px-4 py-2 rounded bg-red-600 text-white">Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
