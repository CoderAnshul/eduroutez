import React, { useState } from 'react';
import axiosInstance from "../../ApiFunctions/axios";
import { AlertCircle, CheckCircle } from 'lucide-react';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const PasswordChangeForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts typing
    setStatus({ type: '', message: '' });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "Password must contain both uppercase and lowercase letters";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.passwordConfirmation) {
      setStatus({
        type: 'error',
        message: 'All fields are required'
      });
      return false;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setStatus({
        type: 'error',
        message: passwordError
      });
      return false;
    }

    if (formData.newPassword !== formData.passwordConfirmation) {
      setStatus({
        type: 'error',
        message: "New password and confirmation don't match"
      });
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setStatus({
        type: 'error',
        message: 'New password must be different from current password'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`${VITE_BASE_URL}/change-password`, {
        password: formData.newPassword,
        password_confirmation: formData.passwordConfirmation
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')
        }
      });

      if (response.data.status === 'success') {
        setStatus({
          type: 'success',
          message: 'Password changed successfully'
        });
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          passwordConfirmation: ''
        });
      }
    } catch (error) {
      let errorMessage = 'Unable to change password, please try again later';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error.response?.status === 403) {
        errorMessage = 'Session expired. Please log in again';
      }
      
      setStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Change Password</h2>

      {status.message && (
        <div className={`flex items-center p-4 mb-6 rounded-lg ${
          status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;