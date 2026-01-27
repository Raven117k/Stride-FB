import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-dark-bg p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
