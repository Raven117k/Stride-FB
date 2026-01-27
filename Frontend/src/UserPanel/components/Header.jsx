import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Header({ onToggleMobileMenu, isMobileMenuOpen }) {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  return (
    <header className="h-16 sm:h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 shrink-0">

      {/* Mobile menu button */}
      <button
        onClick={onToggleMobileMenu}
        className="lg:hidden flex items-center justify-center p-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-xl">
          {isMobileMenuOpen ? "close" : "menu"}
        </span>
      </button>

      <div className="flex-1 max-w-xl mx-4 sm:mx-6 lg:mx-0 lg:ml-0">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg sm:text-xl group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full bg-sidebar border border-white/5 rounded-full py-2 sm:py-2.5 pl-10 sm:pl-12 pr-4 sm:pr-6 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            placeholder="Search analytics, plans, or recipes..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <button
          onClick={() => navigate('/user/notifications')}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition-colors relative"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 size-1.5 sm:size-2 bg-success rounded-full border-2 border-charcoal"></span>
        </button>

        {/* Hide separator on very small screens, show on sm and up */}
        <div className="hidden sm:block h-8 w-[1px] bg-white/10 mx-1 lg:mx-2"></div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hide user info on small screens, show on medium and up */}
          <div className="hidden md:block text-right">
            <p className="text-xs sm:text-sm font-bold text-white leading-none">
              {loading ? "Loading..." : user?.name || "UserDEMO"}
            </p>

          </div>

          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full border border-primary/30 p-0.5">
            <img
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              src={
                user?.avatar
                  ? `http://localhost:5000${user.avatar}`
                  : "/avatar-placeholder.png"
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;