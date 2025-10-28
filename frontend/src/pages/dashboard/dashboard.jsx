// import React from "react";
// import axios from "axios"; // ✅ Import Axios

// export default function Dashboard() {
//   const tasks = {
//     notAssigned: [
//       { id: 1, title: "Design homepage layout", description: "Awaiting team assignment", createdAt: "2025-10-18", deadline: "2025-10-25", assignedTo: "Unassigned" },
//       { id: 2, title: "Database schema setup", description: "No developer assigned yet", createdAt: "2025-10-16", deadline: "2025-10-22", assignedTo: "Unassigned" },
//     ],
//     pending: [
//       { id: 3, title: "API integration", description: "In progress by backend team", createdAt: "2025-10-15", deadline: "2025-10-28", assignedTo: "shiva123@gmail.com" },
//       { id: 4, title: "UI improvements", description: "Pending review", createdAt: "2025-10-14", deadline: "2025-10-27", assignedTo: "john.doe@gmail.com" },
//     ],
//     completed: [
//       { id: 5, title: "Project setup", description: "Completed successfully", createdAt: "2025-10-12", deadline: "2025-10-14", assignedTo: "alice@example.com" },
//       { id: 6, title: "Auth module", description: "Fully tested and merged", createdAt: "2025-10-10", deadline: "2025-10-13", assignedTo: "bob@example.com" },
//     ],
//     all: [
//       { id: 1, title: "Design homepage layout", status: "Not Assigned", createdAt: "2025-10-18", deadline: "2025-10-25", assignedTo: "Unassigned" },
//       { id: 2, title: "Database schema setup", status: "Not Assigned", createdAt: "2025-10-16", deadline: "2025-10-22", assignedTo: "Unassigned" },
//       { id: 3, title: "API integration", status: "Pending", createdAt: "2025-10-15", deadline: "2025-10-28", assignedTo: "shiva123@gmail.com" },
//       { id: 4, title: "UI improvements", status: "Pending", createdAt: "2025-10-14", deadline: "2025-10-27", assignedTo: "john.doe@gmail.com" },
//       { id: 5, title: "Project setup", status: "Completed", createdAt: "2025-10-12", deadline: "2025-10-14", assignedTo: "alice@example.com" },
//       { id: 6, title: "Auth module", status: "Completed", createdAt: "2025-10-10", deadline: "2025-10-13", assignedTo: "bob@example.com" },
//     ],
//   };

//   const sortByDateDesc = (taskArray) =>
//     taskArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   const sectionStyle =
//     "bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200";
//   const cardStyle =
//     "bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-lg p-3 border border-gray-200";

//   // 🔒 Logout handler using Axios
//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/v1/users/logout",
//         {}, // body (empty for logout)
//         {
//           withCredentials: true, // sends cookies (important)
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (response.status === 200) {
//         // ✅ Logout successful
//         localStorage.removeItem("token");
//         window.location.href = "/login"; // redirect to login page
//       } else {
//         alert("Logout failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert(error.response?.data?.message || "Something went wrong during logout.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800 px-6 py-8 font-sans relative">
//       {/* ---------- Header with Logout Button ---------- */}
//       <div className="flex justify-center items-center mb-10 relative">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-green-600 tracking-wide">
//             Task Management Dashboard
//           </h1>
//           <p className="text-gray-500 text-sm mt-2">
//             Overview of all your team’s tasks categorized by status
//           </p>
//         </div>

//         {/* 🔘 Logout button (top-right) */}
//         <button
//           onClick={handleLogout}
//           className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
//         >
//           Logout
//         </button>
//       </div>

//       {/* ---------- Dashboard Grid ---------- */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Left Side (3 Compact Sections) */}
//         <div className="lg:col-span-1 flex flex-col gap-4">
//           {/* Not Assigned Tasks */}
//           <div className={sectionStyle}>
//             <h2 className="text-base font-semibold text-red-500 mb-2">Not Assigned</h2>
//             <div className="space-y-2">
//               {sortByDateDesc(tasks.notAssigned).map((task) => (
//                 <div key={task.id} className={cardStyle}>
//                   <h3 className="text-sm font-medium">{task.title}</h3>
//                   <p className="text-xs text-gray-500 mt-1">{task.description}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Created: {task.createdAt} | Deadline: {task.deadline}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pending Tasks */}
//           <div className={sectionStyle}>
//             <h2 className="text-base font-semibold text-yellow-500 mb-2">Pending</h2>
//             <div className="space-y-2">
//               {sortByDateDesc(tasks.pending).map((task) => (
//                 <div key={task.id} className={cardStyle}>
//                   <h3 className="text-sm font-medium">{task.title}</h3>
//                   <p className="text-xs text-gray-500 mt-1">{task.description}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Created: {task.createdAt} | Deadline: {task.deadline}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Completed Tasks */}
//           <div className={sectionStyle}>
//             <h2 className="text-base font-semibold text-green-500 mb-2">Completed</h2>
//             <div className="space-y-2">
//               {sortByDateDesc(tasks.completed).map((task) => (
//                 <div key={task.id} className={cardStyle}>
//                   <h3 className="text-sm font-medium">{task.title}</h3>
//                   <p className="text-xs text-gray-500 mt-1">{task.description}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Created: {task.createdAt} | Deadline: {task.deadline}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Side (Large All Tasks Section) */}
//         <div className="lg:col-span-3">
//           <div className={`${sectionStyle} h-full`}>
//             <h2 className="text-lg font-semibold text-blue-500 mb-3">All Tasks</h2>
//             <div className="space-y-3">
//               {sortByDateDesc(tasks.all).map((task) => (
//                 <div key={task.id} className={cardStyle}>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-sm font-medium">{task.title}</h3>
//                       <p className="text-xs text-gray-400 mt-1">
//                         Created: {task.createdAt} | Deadline: {task.deadline}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">Assigned To: {task.assignedTo}</p>
//                     </div>
//                     <span
//                       className={`text-xs font-medium px-2 py-0.5 rounded ${
//                         task.status === "Completed"
//                           ? "bg-green-100 text-green-700"
//                           : task.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {task.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";

// export default function Dashboard() {
//   const [emails, setEmails] = useState([""]);

//   // handle change of each email field
//   const handleEmailChange = (index, value) => {
//     const updatedEmails = [...emails];
//     updatedEmails[index] = value;
//     setEmails(updatedEmails);
//   };

//   // add new email input
//   const handleAddEmail = () => {
//     setEmails([...emails, ""]);
//   };

//   // remove an email field
//   const handleRemoveEmail = (index) => {
//     const updatedEmails = emails.filter((_, i) => i !== index);
//     setEmails(updatedEmails);
//   };

//   // submit form
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Inviting:", emails);
//     alert(`Invitations sent to: ${emails.join(", ")}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
//       <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
//         <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
//           Invite Team Members
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {emails.map((email, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-2 border border-gray-200 rounded-md p-2"
//             >
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => handleEmailChange(index, e.target.value)}
//                 required
//                 placeholder={`Enter email ${index + 1}`}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
//               />

//               {/* Remove button only visible if more than one field */}
//               {emails.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveEmail(index)}
//                   className="text-red-500 hover:text-red-700 font-medium text-sm"
//                   title="Remove"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}

//           <div className="flex justify-between items-center">
//             <button
//               type="button"
//               onClick={handleAddEmail}
//               className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
//             >
//               + Add another email
//             </button>

//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow-md text-sm font-semibold transition-all duration-200"
//             >
//               Send Invite Link
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
