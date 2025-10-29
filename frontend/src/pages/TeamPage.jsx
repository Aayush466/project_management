// shiva code
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import InviteModal from "../components/InviteModal";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../features/profile/profileSlice";
import { UserPlus, Trash2 } from "lucide-react";
import axios from "axios";

const TeamPage = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const [members, setMembers] = useState([
    { id: 1, name: "Ayush Shah", email: "ayush@gmail.com" },
    { id: 2, name: "Riya Mehta", email: "riya@gmail.com" },
    { id: 3, name: "Karan Patel", email: "karan@gmail.com" },
  ]);
  const [message, setMessage] = useState("");

  // ✅ Send Invite API Call
  const handleInvite = async (email) => {
    try {
      setMessage("Sending invite...");
      const res = await axios.post(
        "http://localhost:5000/api/users/send-invite",
        { email },
        { withCredentials: true } // ✅ Include cookies for auth
      );

      if (res.data?.success) {
        setMessage(`✅ ${res.data.message}`);

        // Add invited user to table (optional UI update)
        const newMember = {
          id: Date.now(),
          name: res.data.data?.name || "Invited User",
          email: res.data.data?.email || email,
          role: "user",
        };
        setMembers([...members, newMember]);
      } else {
        setMessage("❌ Failed to send invite.");
      }
    } catch (error) {
      console.error("Invite Error:", error.response || error.message);
      setMessage(
        error.response?.data?.message ||
          "❌ Something went wrong while sending invite."
      );
    } finally {
      setTimeout(() => setMessage(""), 3000); // clear message after 3s
    }
  };

  const handleRemove = (id) => {
    setMembers(members.filter((m) => m.id !== id));
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

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3 rounded-md text-center font-medium ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : message.startsWith("❌")
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Team Table */}
        <div className="bg-white shadow rounded-xl mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left text-sm uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                {/* <th className="p-4">Role</th> */}
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {user.myUsers.map((user,index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {user.user.name}
                  </td>
                  <td className="p-4 text-gray-600">{user.user.email}</td>
                  {/* <td className="p-4 capitalize text-gray-600">
                    {member.role}
                  </td> */}
                  <td className="p-4 text-center">
                      <button
                        onClick={() => handleRemove("")}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No team members yet.
            </p>
          )}
        </div>
      </div>

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

// my Api code

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import InviteModal from "../components/InviteModal";
// import { UserPlus, Trash2 } from "lucide-react";

// const API_URL = "http://localhost:8000/api/v1/teams"; // Update with your backend URL

// const TeamPage = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch team members
//   const fetchMembers = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${API_URL}/team-member`);
//       setMembers(data.data); // ApiResponse structure
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to fetch team members");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   // Invite member
//   const handleInvite = async (email) => {
//     console.log("Sending email to backend:", email);
//     try {
//       const { data } = await axios.post(`${API_URL}/invite`, {
//         useremail: email,
//       });
//       setMembers((prev) => [...prev, data.data]);
//       alert(data.message);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to invite member");
//     }
//   };

//   // Remove member
//   const handleRemove = async (id) => {
//     if (!window.confirm("Are you sure you want to remove this member?")) return;

//     try {
//       const { data } = await axios.delete(`${API_URL}/${id}`);
//       setMembers((prev) => prev.filter((m) => m._id !== id));
//       alert(data.message);
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Failed to remove member");
//     }
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
//           {loading ? (
//             <p className="text-center py-6 text-gray-500">
//               Loading team members...
//             </p>
//           ) : members.length === 0 ? (
//             <p className="text-center py-6 text-gray-500">
//               No team members yet.
//             </p>
//           ) : (
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 text-gray-600 text-left text-sm uppercase tracking-wider">
//                   <th className="p-4">Email</th>
//                   <th className="p-4 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {members.map((member) => (
//                   <tr
//                     key={member._id}
//                     className="border-b border-gray-100 hover:bg-gray-50 transition"
//                   >
//                     <td className="p-4 text-gray-700">{member.email}</td>
//                     <td className="p-4 text-center">
//                       {member.role?.toLowerCase() !== "admin" && (
//                         <button
//                           onClick={() => handleRemove(member._id)}
//                           className="text-red-500 hover:text-red-700 transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
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

// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// import InviteModal from "../components/InviteModal";
// import { UserPlus, Trash2 } from "lucide-react";
// import axios from "axios";

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
