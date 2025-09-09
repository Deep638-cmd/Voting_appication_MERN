import React, { useEffect, useState } from 'react'
import image from "./Images/Voting_Image3.jpg"

const Check = () => {
  let [count, setcount] = useState(0);
  const [name, setname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    didi();
  }, [])

  const didi = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://voting-appication-mern.onrender.com/candidate/vote`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setcount(data.votes);
        setname(data.name);
      }
    } catch (err) {
      setError("Failed to fetch voting data");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4
                     bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Check Your Voting Status
        </h1>
        <p className="text-gray-600 text-lg">
          View your current voting statistics
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8
                      border border-gray-200 hover:shadow-lg transition-all duration-300">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-6">
              {/* Candidate Name */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500 mb-1">Candidate Name</span>
                <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
              </div>

              {/* Vote Count */}
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm text-green-600 mb-1">Total Votes</span>
                <div className="text-4xl font-bold text-green-700">
                  {count}
                  <span className="text-base font-normal text-green-600 ml-2">votes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 
                         transform rotate-1 rounded-xl"></div>
          <img 
            src={image} 
            alt="Voting Statistics" 
            className="relative z-10 w-full h-64 sm:h-80 object-cover rounded-xl 
                     shadow-sm hover:shadow-lg transition-all duration-300
                     transform hover:-rotate-1"
          />
        </div>

        {/* Info Card */}
        <div className="mt-8 text-center bg-blue-50 rounded-xl p-6 border border-blue-100">
          <p className="text-blue-700 text-lg">
            Thank you for participating in the voting process!
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Your vote helps shape our future
          </p>
        </div>
      </div>
    </div>
  )
}

export default Check