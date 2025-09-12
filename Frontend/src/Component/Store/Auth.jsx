import { createContext, useContext, useEffect, useState } from "react";
//Deep
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [candidate, setCandidate] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("Token") || null);
  const [role, setRole] = useState(localStorage.getItem("UserRole") || null);

  const isAuthenticated = !!token;

  // ✅ Login function (store in both state + localStorage)
  const login = (tokens, userRole) => {
    setToken(tokens);
    setRole(userRole);
    localStorage.setItem("Token", tokens);
    localStorage.setItem("UserRole", userRole);
  };

  // ✅ Logout function
  const logout = () => {
    setToken(null);
    setRole(null);
    setCandidate(null);
    localStorage.removeItem("Token");
    localStorage.removeItem("UserRole");
  };

  // ✅ Fetch candidate details if token & role exist
  const fetchCandidate = async () => {
    if (!token || role !== "candidate") return; // only fetch if logged in as candidate
    try {
      const response = await fetch(
        `https://voting-appication-mern.onrender.com/candidate/out`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCandidate(data);
      } else {
        console.error("Error fetching candidate:", response.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [token, role]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        token,
        role,
        candidate,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
