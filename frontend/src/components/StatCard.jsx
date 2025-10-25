import React from "react";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between hover:shadow-lg transition-all">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-700">{value}</p>
      </div>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
