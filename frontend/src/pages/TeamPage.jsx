// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import InviteModal from "../components/InviteModal";
// import { UserPlus, Trash2 } from "lucide-react";

// const TeamPage = () => {
//   const [showModal, setShowModal] = useState(false);

//   const [members, setMembers] = useState([
//     { id: 1, name: "Ayush Shah", email: "ayush@gmail.com", role: "admin" },
//     { id: 2, name: "Riya Mehta", email: "riya@gmail.com", role: "user" },
//     { id: 3, name: "Karan Patel", email: "karan@gmail.com", role: "user" },
//   ]);

//   const handleInvite = (email) => {
//     // In real app, send POST request to backend (/api/users/invite)
//     const newMember = {
//       id: Date.now(),
//       name: "Invited User",
//       email,
//       role: "user",
//     };
//     setMembers([...members, newMember]);
//     alert(`Invitation sent to ${email}`);
//   };

//   const handleRemove = (id) => {
//     setMembers(members.filter((m) => m.id !== id));
//   };

//   return (
//     <div className="flex bg-gray-100 min-h-screen">
//       <Sidebar />

//       <div className="flex-1 p-6 space-y-6">
//         <Topbar userName="Ayush" />

//         {/* Header Section */}
//         <div className="flex justify-between items-center mt-6">
//           <h2 className="text-2xl font-semibold text-gray-700">Team Members</h2>
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center space-x-2 bg-[#7B3931] text-white px-4 py-2 rounded-lg hover:bg-[#934940] transition"
//           >
//             <UserPlus size={18} />
//             <span>Invite Member</span>
//           </button>
//         </div>

//         {/* Team Table */}
//         <div className="bg-white shadow rounded-xl mt-4 overflow-x-auto">
//           <table className="min-w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-50 text-gray-600 text-left text-sm uppercase tracking-wider">
//                 <th className="p-4">Name</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Role</th>
//                 <th className="p-4 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {members.map((member) => (
//                 <tr
//                   key={member.id}
//                   className="border-b border-gray-100 hover:bg-gray-50 transition"
//                 >
//                   <td className="p-4 font-medium text-gray-700">
//                     {member.name}
//                   </td>
//                   <td className="p-4 text-gray-600">{member.email}</td>
//                   <td className="p-4 capitalize text-gray-600">
//                     {member.role}
//                   </td>
//                   <td className="p-4 text-center">
//                     {member.role !== "admin" && (
//                       <button
//                         onClick={() => handleRemove(member.id)}
//                         className="text-red-500 hover:text-red-700 transition"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {members.length === 0 && (
//             <p className="text-center text-gray-500 py-6">
//               No team members yet.
//             </p>
//           )}
//         </div>
//       </div>

//       {showModal && (
//         <InviteModal
//           onClose={() => setShowModal(false)}
//           onInvite={handleInvite}
//         />
//       )}
//     </div>
//   );
// };

// export default TeamPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import InviteModal from "../components/InviteModal";
import { UserPlus, Trash2 } from "lucide-react";

const TeamPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Team Members from Backend
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/v1/users/team`);
      setMembers(res.data.data || res.data); // handle ApiResponse or direct array
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ✅ Invite Member API
  const handleInvite = async (email) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/invite`,
        {
          useremail: email,
        }
      );

      // Append new invited member to the list
      const newMember = res.data.data?.user || res.data.data || res.data.user;
      setMembers((prev) => [...prev, newMember]);
      alert(`Invitation sent to ${email}`);
      setShowModal(false);
    } catch (err) {
      console.error("Invite Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to send invite");
    }
  };

  // ✅ Remove Member API
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/v1/users/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id && m.id !== id));
    } catch (err) {
      console.error("Remove Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        <Topbar userName="Ayush" />

        {/* Header Section */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Team Members</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#7B3931] text-white px-4 py-2 rounded-lg hover:bg-[#934940] transition"
          >
            <UserPlus size={18} />
            <span>Invite Member</span>
          </button>
        </div>

        {/* Team Table */}
        <div className="bg-white shadow rounded-xl mt-4 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-6">
              Loading team members...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 py-6">{error}</p>
          ) : members.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No team members yet.
            </p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-left text-sm uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member._id || member.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      {member.username || member.name || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {member.useremail || member.email}
                    </td>
                    <td className="p-4 capitalize text-gray-600">
                      {member.role}
                    </td>
                    <td className="p-4 text-center">
                      {member.role !== "Admin" && (
                        <button
                          onClick={() => handleRemove(member._id || member.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <InviteModal
          onClose={() => setShowModal(false)}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
};

export default TeamPage;
