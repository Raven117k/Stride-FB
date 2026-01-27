// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={closeMobile}
      ></div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-dark-bg border-r border-border-subtle flex flex-col
          transform transition-transform duration-300 md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 max-w-[80vw] sm:max-w-[60vw]`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Top */}
          <div className="flex-shrink-0 sticky top-0 z-10 bg-dark-bg p-4 sm:p-6 flex gap-2 sm:gap-3 items-center">
            <div className="bg-primary w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-charcoal shrink-0">
              <span className="material-symbols-outlined filled-icon text-xl sm:text-2xl">
                bolt
              </span>
            </div>
            <div className="flex flex-col text-xs sm:text-sm truncate">
              <h1 className="text-white font-black leading-tight uppercase truncate">
                Admin Console
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest truncate">
                STRIDE
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto flex flex-col gap-1 px-2 sm:px-3 py-2 min-h-0">
            <SidebarLink to="/admin" icon="dashboard" onClick={closeMobile}>
              Overview
            </SidebarLink>

            <SidebarLink to="/admin/users" icon="group" onClick={closeMobile}>
              User Management
            </SidebarLink>

            <SidebarLink to="/admin/workout" icon="fitness_center" onClick={closeMobile}>
              Workout Management
            </SidebarLink>

            <SidebarLink to="/admin/meal" icon="restaurant" onClick={closeMobile}>
              Meal Management
            </SidebarLink>


            <div className="mt-4">
              <SidebarLink to="/admin/settings" icon="settings" onClick={closeMobile}>
                System Settings
              </SidebarLink>
            </div>
          </nav>

          {/* Bottom */}
          <div className="flex-shrink-0 p-4 bg-dark-bg">
            <div className="flex items-center gap-2 sm:gap-3 p-3 bg-card rounded-xl border border-border-subtle">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-center border border-border-subtle shrink-0"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCxYtRYl4M8S9FUERLKSZbZU0CrCFLAbn4j7Z6yVfjyGoNdzlE0cEmSuTZ-5RNgAQVSLuQl9SHVd_-3MlyTnqWoErFHC9AQgEchsr1gvCMw6RNCzcTGC311jr5GttpxOVGGZGXzbtlhq6bEavwnEO3cKAG6xlR-3P_-2kqRedT-SgpiBF_B2f_JGbY3ft_2hckWpwUfZua2k0Am0tp52qvWm1MrmxILHN_jjAuTwrupcw-aWTeJ5RTdnM5gtx96oVakJVOWi2Qthg)",
                }}
              />
              <div className="overflow-hidden text-xs sm:text-sm">
                <p className="text-white font-bold truncate">Admin Principal</p>
                <p className="text-primary font-black uppercase tracking-tighter truncate">
                  Superuser Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${isActive
          ? "sidebar-active text-white"
          : "text-gray-400 hover:bg-white/5"
        }`
      }
    >
      <span
        className="material-symbols-outlined text-lg sm:text-2xl"
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
      >
        {icon}
      </span>
      <p className="text-xs sm:text-sm font-semibold truncate">{children}</p>
    </NavLink>
  );
}
