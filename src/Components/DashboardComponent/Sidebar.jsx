import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/Images/logo.png";
import favicon from "../../assets/Images/favicon.png";
import axiosInstance from "../../ApiFunctions/axios";
const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "My Profile", path: "/dashboard/profile-page", icon: "👤" },
    { name: "Wishlist", path: "/dashboard/wishlist", icon: "🏫" },
    { name: "My Documents", path: "/dashboard/documents", icon: "📄" },
    { name: "Talk to Counselor", path: "/dashboard/counselor", icon: "👤" },
    { name: "My Reviews", path: "/dashboard/reviews", icon: "📝" },
    { name: "Scheduled Slots", path: "/dashboard/slots", icon: "📅" },
    { name: "Payout", path: "/dashboard/payout", icon: "💰" },
    { name: "Webinars", path: "/dashboard/webinar", icon: "🎥" },
    { name: "Refer & Earn", path: "/dashboard/refer&earn", icon: "🏫" },
    { name: "Redeem", path: "/dashboard/redeem", icon: "🎁" },
    { name: "Settings", path: "/dashboard/settings", icon: "⚙️" },
    { name: "Logout", path: "/dashboard/logout", icon: "🚪" },
  ];

  const handleLogout = async (name) => {
    if (name === "Logout") {
      try {
        await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/logout`, {}, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          }
        });
      } catch (error) {
        console.error("Error during logout API call:", error);
      } finally {
        localStorage.clear();
        window.location.href = "/";
      }
    }
  };

  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <aside className="w-64 h-screen min-h-fit bg-gray-100 p-4 hidden md:block">
        <div className="text-center mb-14 w-full">
          <Link to="/">
            <img className="h-6 md:h-8" src={logo} alt="mainLogo" />
          </Link>
        </div>
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"} // Add 'end' only for the Dashboard route
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-md ${isActive ? "bg-[#b82025] text-white" : "hover:bg-gray-200"
                    }`
                  }
                  onClick={() => handleLogout(item.name)}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Navbar for small screens */}
      <nav className="w-14 bg-gray-100 p-4 flex flex-col gap-14 items-center md:hidden min-h-fit">
        <Link to="/">
          <img className="h-6 hidden md:flex" src={logo} alt="mainLogo" />
          <img className="h-6 mt-3 md:hidden" src={favicon} alt="mainLogo" />
        </Link>
        <ul className="flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.path === "/dashboard"} // Add 'end' only for the Dashboard route
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-[#b82025] text-white" : "hover:bg-gray-200"
                  }`
                }
              >
                <span>{item.icon}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
