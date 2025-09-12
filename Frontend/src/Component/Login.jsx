import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from './Store/Auth';
import { toast } from 'react-toastify';
import { ValidationRules } from './ValidationRules';

const Login = () => {
  // State management
  const [showEmailRules, setShowEmailRules] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setrole] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });

  // UI control states
  const [voterLogin, setVoterLogin] = useState(null);
  const [candidateLogin, setCandidateLogin] = useState(null);
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Style constants
  const inputClass = `
    w-full px-4 py-3 
    bg-white border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
    placeholder-gray-500 text-gray-700 transition duration-200
    text-base sm:text-sm
    shadow-sm hover:bg-gray-50
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const buttonClass = `
    w-full py-3 px-4 
    rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transform transition-all duration-300 
    hover:scale-[1.02] active:scale-[0.98] 
    font-medium text-base sm:text-lg
    shadow-md
  `;

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (name === 'email') {
      if (!value) {
        setEmailError('Email is required');
      } else if (!validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }

    if (name === 'password') {
      if (!value) {
        setPasswordError('Password is required');
      } else if (!validatePassword(value)) {
        setPasswordError('Password does not meet requirements');
      } else {
        setPasswordError('');
      }
    }
  };

  // Handle form submission with optimizations
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isLoading) return;

    if (!formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`https://voting-appication-mern.onrender.com/${formData.role}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        signal: controller.signal // Add abort signal
      });

      clearTimeout(timeoutId); // Clear timeout if request completes

      if (response.ok) {
        const data = await response.json();
        setrole(formData.role);
        
        // Execute these operations in parallel
        await Promise.all([
          login(data.token, formData.role),
          localStorage.setItem("UserRole", formData.role)
        ]);
        
        toast.success(`Logged in successfully as ${formData.role}`);
        
        // Reduce navigation delay
        setTimeout(() => {
          navigate("/");
        }, 500); // Reduced from 1500ms to 500ms
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      
      // Better error messaging
      if (err.name === 'AbortError') {
        toast.error("Request timed out. Please check your connection and try again.");
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false); // Always reset loading state
    }

    // Only reset form on success or specific errors
    setFormData({
      email: "",
      password: "",
      role: ""
    });
  };

  // Handle role selection
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setValue(selectedRole);
    setFormData(prev => ({ ...prev, role: selectedRole }));
    setVoterLogin(selectedRole === "voter");
    setCandidateLogin(selectedRole === "candidate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Login</h2>
          <p className="mt-2 text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              className={inputClass}
              disabled={isLoading}
              required
            >
              <option value="">Select your role</option>
              <option value="voter">Voter</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter your email"
              disabled={isLoading}
              required
              onFocus={() => setShowEmailRules(true)}
              onBlur={() => setShowEmailRules(false)}
            />
            {showEmailRules && <ValidationRules type="email" />}
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
                placeholder="Enter your password"
                disabled={isLoading}
                required
                onFocus={() => setShowPasswordRules(true)}
                onBlur={() => setShowPasswordRules(false)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            {showPasswordRules && <ValidationRules type="password" />}
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonClass} ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Connection Status Indicator */}
        {isLoading && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Connecting to server...</p>
            <p className="text-xs mt-1">This may take a moment if the server is starting up</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;