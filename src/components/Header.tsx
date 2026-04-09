"use client";

import { useState } from "react";
import Link from "next/link";
import NavOverlay from "./NavOverlay";

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-7 mix-blend-normal">
        {/* Wordmark */}
        <Link
          href="/"
          onClick={() => setNavOpen(false)}
          className="font-serif text-xs tracking-[0.3em] uppercase text-[#1a1a2e] hover:opacity-50 transition-opacity duration-300"
        >
          Goliath Investment Group
        </Link>

        {/* Hamburger — 3 lines */}
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          className="flex flex-col gap-[5px] group cursor-pointer"
        >
          <span className="block w-6 h-px bg-[#1a1a2e] transition-all duration-300" />
          <span className="block w-6 h-px bg-[#1a1a2e] transition-all duration-300" />
          <span className="block w-4 h-px bg-[#1a1a2e] transition-all duration-300 group-hover:w-6" />
        </button>
      </header>

      <NavOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}
