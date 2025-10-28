import React, { useState } from "react";
import { X } from "lucide-react";

const InviteModal = ({ onClose, onInvite }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onInvite(email);
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Invite New Member
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7B3931] outline-none"
          />
          <button
            type="submit"
            className="w-full bg-[#7B3931] text-white py-2 rounded-lg hover:bg-[#934940] transition"
          >
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
