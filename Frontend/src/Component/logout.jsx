import { useEffect } from 'react';
import { useAuth } from "./Store/Auth";
import { Navigate, useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      const handleLogout = async () => {
      try {   
        await logout();
        // Use toast notification instead of alert for better UX
        setTimeout(() => {
      //alert(` Logout Sucessfully`)
          navigate('/login');
        }, 1500); // Give time for the user to see the success message
      } catch (error) {
        console.error("Logout failed:", error);
        navigate('/');
      }
    };

    handleLogout();
  }, [logout, navigate]);


  // Redirect to home if already logged out
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state while logging out
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Logging out...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default Logout;