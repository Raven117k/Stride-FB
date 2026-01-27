import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function UserLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-charcoal overflow-hidden">
        {/* Header */}
        <Header 
          onToggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

export default UserLayout;