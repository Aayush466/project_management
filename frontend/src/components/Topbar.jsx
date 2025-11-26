import { useSelector } from "react-redux";

const Topbar = ({handleOpenSideBar}) => {
  const userProfile = useSelector((state) => state.profile.user);
 
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700">
        Welcome back, {userProfile.name} 👋
      </h2>

      <div className="flex items-center space-x-4">
        <div
          className="hidden relative cursor-pointer w-10 h-10 rounded-full sm:flex items-center justify-center bg-gray-300 font-semibold text-gray-700 hover:opacity-80 transition"
          title="Click to upload profile photo"
        >
          {
            <span>
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
            </span>
          }
        </div>
        <button className="flex sm:hidden" onClick={()=>handleOpenSideBar(true)}>
            ☰
          </button>
      </div>
    </div>
  );
};

export default Topbar;
