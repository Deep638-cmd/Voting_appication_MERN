import React, { useEffect, useState } from 'react'
import image from "./Images/Voting_Image2.png"
import { Link } from "react-router-dom";
import { useAuth } from './Store/Auth';

const Home = () => {
const {isAuthenticated}=useAuth();
//const [isOpen, setIsOpen] = useState(false);
  //const { isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState(null);
const [name,setname]=useState("");
const[checkcandidate,setCheckcandidate]=useState(false);
const[checkvoter,setCheckvoter]=useState(false);

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
          setCheckvoter(true)
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
          setCheckcandidate(true)
          setname(data.name);
          return;
        }
      }

      // If neither voter nor candidate
      console.log("User role not found");
      setUserRole(null);
      setCheckvoter(false)
      setCheckcandidate(false)
      setname("");

    } catch (err) {
      console.error("Error checking user role:", err);
      setUserRole(null);
      setCheckvoter(false)
      setCheckcandidate(false)
      setname("");
    }
  };

 

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4 
                        bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
            Online Voting System
          </h1>
          <div className='mt-6 space-y-2'>
            <h2 className='text-2xl md:text-3xl font-semibold text-gray-700'>
              Welcome
            </h2>
            <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
              to the Home page of Online voting application
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mb-16'>
     { isAuthenticated && checkvoter &&
                      
                     
                      
                      
          <Link  
            to="/vote"

            className='px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 
                      text-white font-semibold rounded-lg shadow-md 
                      hover:from-green-600 hover:to-green-700
                      transform hover:scale-105 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            
          >
            Vote Now
          </Link>
          }
                        
   { isAuthenticated && checkcandidate &&      <Link  
            to="/check"

            className='px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 
                      text-white font-semibold rounded-lg shadow-md 
                      hover:from-green-600 hover:to-green-700
                      transform hover:scale-105 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            
          >
            Check Now
          </Link>}


       {!isAuthenticated &&   <Link 
            to="/login"

            className='px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                      text-white font-semibold rounded-lg shadow-md 
                      hover:from-blue-600 hover:to-blue-700
                      transform hover:scale-105 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  '
           
          >
            Login Now
          </Link> }
          
        </div>

        {/* Image Container */}
        <div className='relative max-w-4xl mx-auto'>
          <div className='absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 
                         transform rotate-1 rounded-lg'>
          </div>
          <img 
            src={image} 
            alt='Voting Illustration' 
            className='relative z-10 w-full rounded-lg shadow-xl 
                     hover:shadow-2xl transition-all duration-300
                     transform hover:-rotate-1'
          />
        </div>

        {/* Optional: Add a call-to-action section */}
        <div className='mt-16 text-center'>
          <p className="text-2xl font-semibold mb-4 bg-gradient-to-r from-green-500 via-green-500 to-blue-700 bg-clip-text text-transparent">
  Make your voice heard. Every vote counts!
</p>

       {!isAuthenticated &&     <Link 
            to="/register"
            className='inline-block px-6 py-2 text-green-600 font-medium
                      hover:text-green-700 underline decoration-2 underline-offset-4
                      transition-colors duration-300'
          >
            Register to Vote →
          </Link> }
        </div>
      </div>
    </div>
  )
}

export default Home