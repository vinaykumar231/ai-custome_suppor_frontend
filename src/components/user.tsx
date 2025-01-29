import React, { useEffect, useState } from "react";
import axios from "../helper/axios";

// Define the type for the user data
interface User {
  user_id: number;
  username: string;
  email: string;
  user_type: string;
  phone_no: string; // Changed to string to avoid number formatting issues
}

const UsersList: React.FC = () => {
  // State to store the list of users
  const [users, setUsers] = useState<User[] | undefined>(undefined); // Allow undefined
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/get_all_users", {
          headers: {
            accept: "application/json",
          },
        });
        // Check if the response is valid
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data); // Set the users data
        } else {
          throw new Error("Invalid data format.");
        }
      } catch (error) {
        setError("Error fetching users. Please try again later.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading when request is complete
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-6">Loading Users...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-6 text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Users List</h1>
      {users && users.length === 0 ? (
        <p className="text-gray-500">No users available.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead className="bg-gray-100 text-left text-gray-600">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">User Type</th>
              <th className="px-4 py-2">Phone No</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.user_id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{user.user_id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.user_type}</td>
                  <td className="px-4 py-2">{user.phone_no}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
