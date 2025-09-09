

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    stream: '',
    email: '',
    address: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  // UI control states
  const [register, setregister] = useState(null);
  const [candidateregister, setcandidateregister] = useState(null);
  const [value, setvalue] = useState("");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

    console.log(formData);
try{
  let datas={...formData};
  const response=await fetch(`http://localhost:3000/${datas.role}/register`,{
method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datas)

  })
let data = await response.json();

    if (!response.ok) {
      // ✅ If Zod failed, backend returns { message: "error text" }
      if (data.message) {
        toast.error(data.message);
      } else {
        toast.error("Something went wrong!");
      }
      return;
    }
  if(response.ok){
     toast.success("Registration successful!");
   // let data=await response.json();
  console.log("our data is",data);
  setFormData({
name: '',
    age: '',
    stream: '',
    email: '',
    address: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    role: ''


})
navigate("/login")

  }

} catch(err){
  console.log(err);
  toast.error("Server connection failed!");
}






    // Add your API integration here
  };

  const deep = (e) => {
    let targets = e.target.value;
    setvalue(targets);
    setFormData({ ...formData, role: targets });
    if (targets === "voter") {
      setregister(true);
      setcandidateregister(false);
    }
    if (targets === "candidate") {
      setcandidateregister(true);
      setregister(false);
    }
  };

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

const cardClass = `
  max-w-2xl mx-auto bg-white/95 backdrop-blur-sm 
  rounded-xl shadow-xl p-4 sm:p-6 md:p-8 
  border border-gray-200
  transform transition-all duration-300 ease-in-out
`;

const buttonClass = `
  w-full py-3 px-4 
  rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-offset-2 
  transform transition-all duration-300 
  hover:scale-[1.02] active:scale-[0.98] 
  font-medium text-base sm:text-lg
  shadow-lg
`;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 sm:py-8 md:py-12 px-3 sm:px-6 lg:px-8 text-gray-800">
    {/* Role Selection Card */}
    <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
      <div className={`${cardClass} !p-4 sm:!p-6`}>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-700 whitespace-nowrap">Register as</h1>
            <select
              value={value}
              onChange={deep}
              className={`${inputClass} text-center sm:text-left`}
            >
              <option value="">Select Role</option>
              <option value="voter">Voter</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voter Registration Form */}
      {register && (
        <div className={cardClass}>
           <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 
                     bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          Voter Registration
        </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Age (18-60)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Must be 18-60 years"
                  min="18"
                  max="60"
                  required
                />
              </div>

              {/* Stream Input */}
             <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-600">Stream</label>
  <select
    name="stream"
    value={formData.stream}
    onChange={handleChange}
    className={inputClass}
    required
  >
    <option value="">Select Stream</option>
    <option value="CSE">Computer Science (CSE)</option>
    <option value="ECE">Electronics (ECE)</option>
    <option value="IT">Information Technology (IT)</option>
    <option value="ME">Mechanical (ME)</option>
    <option value="EE">Electrical (EE)</option>
    <option value="CE">Civil (CE)</option>
  </select>
</div>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Pincode Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter pincode"
                  pattern="\d{6}"
                  required
                />
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`${inputClass} min-h-[80px] sm:min-h-[100px]`}
                placeholder="Enter your full address"
                rows="3"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                             text-gray-400 hover:text-white transition-colors duration-200
                             focus:outline-none group-hover:text-gray-300"
                  >
                    {showPassword ? 
                      <AiOutlineEyeInvisible className="w-5 h-5" /> : 
                      <AiOutlineEye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                             text-gray-400 hover:text-white transition-colors duration-200
                             focus:outline-none group-hover:text-gray-300"
                  >
                    {showConfirmPassword ? 
                      <AiOutlineEyeInvisible className="w-5 h-5" /> : 
                      <AiOutlineEye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
          type="submit"
          className={`${buttonClass} bg-gradient-to-r from-green-600 to-green-500 
                   hover:from-green-700 hover:to-green-600
                   text-white focus:ring-green-500
                   hover:shadow-green-500/25 mt-6`}
        >
          Register as Voter
        </button>
          </form>

          {/* Login Link */}
         <div className="mt-6 text-center text-sm sm:text-base">
          <span className="text-gray-600">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium 
                     hover:underline decoration-2 underline-offset-4
                     p-2 -m-2"
          >
            Login
          </button>
        </div>
      </div>
      )}

      {/* Candidate Registration Form */}
      {candidateregister && (
        <div className={cardClass}>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 
                     bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Candidate Registration
        </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Age (25-70)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Must be 25-70 years"
                  min="25"
                  max="70"
                  required
                />
              </div>

              {/* Stream Input */}
             <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-600">Stream</label>
  <select
    name="stream"
    value={formData.stream}
    onChange={handleChange}
    className={inputClass}
    required
  >
    <option value="">Select Stream</option>
    <option value="CSE">Computer Science (CSE)</option>
    <option value="ECE">Electronics (ECE)</option>
    <option value="IT">Information Technology (IT)</option>
    <option value="ME">Mechanical (ME)</option>
    <option value="EE">Electrical (EE)</option>
    <option value="CE">Civil (CE)</option>
  </select>
</div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                             text-gray-400 hover:text-white transition-colors duration-200
                             focus:outline-none group-hover:text-gray-600"
                  >
                    {showPassword ? 
                      <AiOutlineEyeInvisible className="w-5 h-5" /> : 
                      <AiOutlineEye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                             text-gray-400 hover:text-white transition-colors duration-200
                             focus:outline-none group-hover:text-gray-300"
                  >
                    {showConfirmPassword ? 
                      <AiOutlineEyeInvisible className="w-5 h-5" /> : 
                      <AiOutlineEye className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
             <button
          type="submit"
          className={`${buttonClass} bg-gradient-to-r from-blue-600 to-blue-500 
                   hover:from-blue-700 hover:to-blue-600
                   text-white focus:ring-blue-500
                   hover:shadow-blue-500/25 mt-6`}
        >
          Register as Candidate
        </button>



          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm sm:text-base">
          <span className="text-gray-600">Already have an account? </span>
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 font-medium 
                     hover:underline decoration-2 underline-offset-4
                     p-2 -m-2"
          >
            Login
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Register;