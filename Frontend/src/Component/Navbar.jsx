import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "./Store/Auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [name,setname]=useState("");

  useEffect(() => {
    if (isAuthenticated) {
      checkUserRole();
    }
  }, [isAuthenticated]);

  const checkUserRole = async () => {
    try {
      // Try voter check first
      const voterResponse = await fetch(`https://voting-appication-mern.onrender.com/voter/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`
        },
      });

      if (voterResponse.ok) {
        const data = await voterResponse.json();
        console.log("NAVBAR Voter Data:", data);
        if (data && data.role === 'voter') {
          setUserRole('voter');
          setname(data.name);
          return; // Exit if voter found
        }
      }

      // If not voter, check for candidate
      const candidateResponse = await fetch(`https://voting-appication-mern.onrender.com/candidate/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`
        },
      });

      if (candidateResponse.ok) {
        const data = await candidateResponse.json();
        console.log("NAVBAR Candidate Data:", data);
        if (data && data.role === 'candidate') {
          setUserRole('candidate');
          setname(data.name);
          return;
        }
      }

      // If neither voter nor candidate
      console.log("User role not found");
      setUserRole(null);
      setname("");

    } catch (err) {
      console.error("Error checking user role:", err);
      setUserRole(null);
      setname("");
    }
  };
  // Define navigation items based on auth status and role
  const navItems = [
    { name: "Home", path: "/" },
    { 
      name: "Vote", 
      path: "/vote", 
      protected: true, 
      showFor: ['voter']
    },
    { 
      name: "Check", 
      path: "/check", 
      protected: true, 
      showFor: ['candidate']
    },
    { name: "Register", path: "/register", authOnly: false },
    { name: "Login", path: "/login", authOnly: false },
    { name: "Logout", path: "/logout", protected: true },
    { name: "ChangePassword", path: "/changepassword", protected: true }
  ];

  // Updated filter to include role-based conditions
  const filteredNavItems = navItems.filter(item => {
    if (item.protected && !isAuthenticated) return false;
    if (item.authOnly === false && isAuthenticated) return false;
    if (item.showFor && !item.showFor.includes(userRole)) return false;
    return true;
  });

  // ...rest of the component remains the same...
  let Name =name || "User";
  let Role= userRole || "Role";



  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-green-600 hover:scale-110 transition-transform duration-300">
          {Name} <span className="text-2xl text-blue-600 ">as</span> {Role}
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `hover:text-green-500 transition-colors duration-200 ${
                  isActive
                    ? "text-green-600 border-b-2 border-green-600 pb-1"
                    : "text-gray-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none text-gray-600 hover:text-green-600"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 text-lg font-medium bg-white">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block hover:text-green-500 transition-colors duration-200 ${
                  isActive ? "text-green-600" : "text-gray-600"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;