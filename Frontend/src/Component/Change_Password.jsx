import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from './Store/Auth';
import { toast } from "react-toastify";
const Change_Password = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
console.log("The getiing data from localstorage is: ",localStorage.getItem("UserRole"))
  let Role=userRole || localStorage.getItem("UserRole");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Determine the endpoint based on user role
      const endpoint = Role === 'voter' 
        ? 'https://voting-appication-mern.onrender.com/voter/ChangePassword'
        : 'https://voting-appication-mern.onrender.com/candidate/changepassword';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('Token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
         toast.success(data.message || "Password updated successfully!");
        setSuccess(data.message);
        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: ""
        });
        // Redirect after successful password change
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(data.message || "Failed to change password");
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Password change error:', err);
    }
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ...existing style constants...

  const inputClass = `
  w-full px-4 py-3 
  bg-white border border-gray-300 rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
  placeholder-gray-500 text-gray-700 transition duration-200
  text-base sm:text-sm
  shadow-sm hover:bg-gray-50
`;

const cardClass = `
  bg-white rounded-xl shadow-lg p-6 
  border border-gray-200 
  transition-all duration-300
`;

const buttonClass = `
  w-full py-3 px-4 
  rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-offset-2 
  transform transition-all duration-300 
  hover:scale-[1.02] active:scale-[0.98] 
  font-medium text-base sm:text-lg
`;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-md mx-auto mb-8">
        <div className={cardClass}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 
                      bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Change Password
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative group">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter your current password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 transition-colors duration-200
                           focus:outline-none group-hover:text-gray-500"
                >
                  {showCurrentPassword ? 
                    <AiOutlineEyeInvisible className="w-5 h-5" /> : 
                    <AiOutlineEye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            {/* New Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-400 hover:text-gray-600 transition-colors duration-200
                           focus:outline-none group-hover:text-gray-500"
                >
                  {showNewPassword ? 
                    <AiOutlineEyeInvisible className="w-5 h-5" /> : 
                    <AiOutlineEye className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`${buttonClass} bg-gradient-to-r from-green-600 to-green-500 
                       hover:from-green-700 hover:to-green-600
                       text-white focus:ring-green-500
                       hover:shadow-lg hover:shadow-green-500/25`}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Change_Password;