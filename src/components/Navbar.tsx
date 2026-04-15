'use client';

import { Diamond, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { path: "/", label: "Analyze" },
  { path: "/extract", label: "Extract Frames" },
  { path: "/transcribe", label: "Transcribe" },
  { path: "/summarize", label: "Summarize" },
  { path: "/search", label: "Search Moments" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="h-[52px] bg-card border-b border-border flex items-center px-4 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-1.5 shrink-0">
        <Diamond className="w-4 h-4 text-amber-500 fill-amber-500" />
        <span className="text-[15px] font-semibold text-foreground">Video Analysis</span>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6 mx-auto">
        {navLinks.map(({ path, label }) => (
          <Link
            key={path}
            href={path}
            className={`text-[13px] font-medium transition-all duration-200 pb-0.5 border-b-2 ${
              pathname === path
                ? "text-amber-600 border-amber-500"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden ml-auto mr-2 p-1.5 text-muted-foreground hover:text-foreground"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="hidden md:flex items-center gap-3 shrink-0">
        <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          Sign in
        </button>
        <button className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-1.5 rounded-btn transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          Get started
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-[52px] left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-2 md:hidden animate-fade-in z-50 shadow-lg">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              onClick={() => setMobileOpen(false)}
              className={`text-[14px] font-medium py-2.5 px-3 rounded-btn text-left transition-colors min-h-[44px] block ${
                pathname === path
                  ? "text-amber-600 bg-amber-50"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 mt-2 pt-2 border-t border-border">
            <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors py-2">
              Sign in
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-primary-foreground text-[13px] font-medium px-4 py-2 rounded-btn transition-all">
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
