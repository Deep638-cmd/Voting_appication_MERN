import React, { useEffect, useState } from 'react'
import Image from "./Images/Voting_Image1.jpg"
import { useAuth } from './Store/Auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"; 
const Vote = () => {
  const navigate = useNavigate();
  const { candidate } = useAuth();
  console.log(candidate)
  // State management
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check voting status on component mount
  useEffect(() => {
    checkVotingStatus();
  }, []);

  // Check if user has already voted
  const checkVotingStatus = async () => {
    try {
      const response = await fetch('https://voting-appication-mern.onrender.com/voter/get', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHasVoted(data.hasvoted);
      }
    } catch (err) {
      setError('Failed to check voting status');
      console.error(err);
    }
  };

  // Handle vote submission
  const handleVote = async (candidateId, candidateName) => {
    if (hasVoted) {
       toast.warning("You have already voted!");
      navigate("/");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://voting-appication-mern.onrender.com/voter/vote', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("Token")}`
        },
        body: JSON.stringify({ candidateId })
      });

      if (response.ok) {
        setHasVoted(true);
         toast.success(`✅ Vote successfully cast for ${candidateName}`);
        navigate("/");
      } else {
        const data = await response.json();
        toast.error(data.message || "❌ Failed to cast vote");
        setError(data.message || 'Failed to cast vote');
      }
    } catch (err) {
       toast.error("❌ Failed to connect to server");
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4
                     bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent
                     filter drop-shadow-sm">
          Welcome To The Vote Page
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your vote matters! Make your choice wisely.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 
                      text-red-700 rounded-r-lg shadow-sm">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      {/* Voting Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 mb-8
                    border border-gray-200 hover:shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {hasVoted ? 'You have already voted' : 'Give Your Vote'}
        </h2>
        
        {/* Candidates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {candidate && candidate.map((item) => (
            <div key={item._id} 
                 className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-6
                          border border-gray-200 hover:border-green-500 
                          hover:shadow-md transition-all duration-300
                          transform hover:scale-[1.02]">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center">
                    <span className="mr-2">📧</span>
                    {item.email}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">🎓</span>
                    Stream: {item.stream}
                  </p>
                </div>
                <button 
                  className={`w-full px-4 py-3 rounded-lg font-medium
                           transform transition-all duration-300 
                           ${hasVoted 
                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                             : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:shadow-md hover:from-green-600 hover:to-green-700'
                           }`}
                  onClick={() => handleVote(item._id, item.name)}
                  disabled={hasVoted || loading}
                >
                  {loading ? 'Voting...' : hasVoted ? 'Already Voted' : 'Vote Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="max-w-4xl mx-auto relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 
                       transform rotate-1 rounded-xl opacity-75"></div>
        <img  
          src={Image}
          alt="Voting Illustration"
          className="relative z-10 w-full h-64 sm:h-80 object-cover rounded-xl 
                   shadow-sm hover:shadow-lg transition-all duration-300 
                   transform hover:-rotate-1"
        />
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4 py-8">
        <p className="text-gray-600 text-lg leading-relaxed">
          Your vote helps shape the future of our institution.
        </p>
        <p className="text-green-600 font-medium">
          Every vote counts! 🗳️
        </p>
        {hasVoted && (
          <div className="inline-block px-6 py-3 bg-green-50 rounded-full 
                        text-green-700 font-medium border border-green-200">
            Thank you for voting! ✨
          </div>
        )}
      </div>
    </div>
  );
}

export default Vote;