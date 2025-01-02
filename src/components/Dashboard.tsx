import { useState, useEffect } from "react";
import axios from "../helper/axios";
import { FaPhoneAlt, FaClock, FaRupeeSign } from "react-icons/fa"; // For icons
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogin } from "../auth/LoginContext";
import { MouseEvent } from 'react';

// Define types for the call data
interface CallData {
  call_id: string;
  customer_name: string;
  call_type: string;
  duration: string;
  call_cost: string;
  summary: string;
  customer_number: string;
  recording_url: string;
}

interface DashboardData {
  total_calls: number;
  total_duration_minutes: number;
  overall_cost: string;
  calls: CallData[];
}

const Dashboard = () => {
  const [callsData, setCallsData] = useState<CallData[]>([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [overallCost, setOverallCost] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Set number of items per page
  const { logout } = useLogin();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get<DashboardData>("/api/Vapi_dashboard_data");
      const data = response.data;

      setCallsData(data.calls);
      setTotalCalls(data.total_calls);
      setTotalDuration(data.total_duration_minutes);
      setOverallCost(data.overall_cost);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get current calls to display
  const indexOfLastCall = currentPage * itemsPerPage;
  const indexOfFirstCall = indexOfLastCall - itemsPerPage;
  const currentCalls = callsData.slice(indexOfFirstCall, indexOfLastCall);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCalls / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto">
        <div className=" flex gap-[80%]">
          <div className="flex items-center space-x-2 ml-4 mb-6  justify-start">
            <Link to="https://docs.google.com/spreadsheets/d/1mU4j8cfte4ZamNLC89CrGsARS54dTD52srC6fedUzdw/edit?gid=0#gid=0" className="block py-2.5 px-6 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transform transition-all duration-300 ease-in-out">Upload data</Link>
          </div>
          <div className="flex items-center space-x-2 ml-4 mb-6  justify-end">
            <LogOut className="w-6 h-6 text-red-500 transform transition-transform duration-300 hover:scale-125" />
            <Link
              to="/"
              className="block py-2.5 px-6 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transform transition-all duration-300 ease-in-out"
              onClick={handleLogout}
            >
              Logout
            </Link>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">MaitriAI Customer Support Dashboard</h1>

        {/* Total Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FaPhoneAlt className="text-blue-500 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Total Calls</h2>
              <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FaClock className="text-green-500 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Total Duration</h2>
              <p className="text-2xl font-bold text-gray-900">{totalDuration} minutes</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FaRupeeSign className="text-yellow-500 text-3xl mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Overall Cost</h2>
              <p className="text-2xl font-bold text-gray-900">{overallCost}</p>
            </div>
          </div>
        </div>

        {/* Calls List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCalls.map((call) => (
            <div
              key={call.call_id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{call.customer_name}</h3>
                <p className="text-sm text-gray-500">{call.customer_number}</p>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Call Type:</span>
                <span className="text-gray-900">{call.call_type}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="text-gray-900">{call.duration}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Call Cost:</span>
                <span className="text-gray-900">{call.call_cost}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium text-gray-700">Summary:</span>
                <p className="text-gray-900">{call.summary}</p>
              </div>
              <div
                key={call.call_id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-700">Customer Name:</span>
                  <span className="text-lg text-gray-900">{call.customer_name}</span>
                </div> */}
                {/* Other details */}
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-700">Recording:</span>
                  <audio
                    controls
                    className="w-full"
                  >
                    <source src={call.recording_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg disabled:bg-gray-200"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} rounded-lg mx-1`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
