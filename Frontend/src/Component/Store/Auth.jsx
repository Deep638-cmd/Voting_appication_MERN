import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext=createContext();
export  const AuthProvider=({children})=>{
const[candidate,setcandidate]=useState();
  const [token, setToken] = useState(localStorage.getItem("Token"));
const Localstorage=(tokens)=>{
setToken(tokens);
localStorage.setItem("Token",tokens)
}

const isAuthenticated = !!token;


const gandu = async () => {
  try {
    const response = await fetch(`https://voting-appication-mern.onrender.com/candidate/out`, {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    if (response.ok) {
      const data = await response.json();  // ✅ await here
      console.log(data);
      console.log("type",typeof(data))

      setcandidate(data)
      
    } else {
      console.error("Error fetching candidate:", response.status);
    }
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
    gandu();
  }, []);


const logout=()=>{
setToken("");
return {Token: localStorage.removeItem("Token"),
  Role : localStorage.removeItem("UserRole")}



  }


   








   return (
       <AuthContext.Provider value={{
        Localstorage,
        token,
        candidate,
        logout,
        isAuthenticated,

       }}>
{children}
       </AuthContext.Provider>
     );




 }
 
    export const useAuth=()=>{
return useContext(AuthContext);
    }