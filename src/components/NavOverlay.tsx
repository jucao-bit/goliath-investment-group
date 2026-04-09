"use client";

import { useEffect } from "react";
import Link from "next/link";

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    label: "Equity Research",
    href: "/equity-research",
    external: false,
    description: "Deep-dive company analysis",
  },
  {
    label: "Blog",
    href: "/blog",
    external: false,
    description: "Markets, technology & investing",
  },
  {
    label: "Team",
    href: "/about",
    external: false,
    description: "About Goliath Investment Group",
  },
];

export default function NavOverlay({ isOpen, onClose }: NavOverlayProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0d0d0d] transition-all duration-500 ease-in-out flex flex-col ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 md:px-14 py-7">
        <Link
          href="/"
          onClick={onClose}
          className="font-serif text-xs tracking-[0.3em] uppercase text-[#faf8f5] hover:opacity-50 transition-opacity duration-300"
        >
          Goliath Investment Group
        </Link>

        {/* Close X */}
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="flex flex-col gap-[5px] group cursor-pointer"
        >
          <span className="block w-6 h-px bg-[#faf8f5] rotate-45 translate-y-[3px] transition-all duration-300" />
          <span className="block w-6 h-px bg-[#faf8f5] -rotate-45 -translate-y-[3px] transition-all duration-300" />
        </button>
      </div>

      {/* Nav links — centered, large */}
      <nav className="flex-1 flex flex-col justify-center px-8 md:px-14 pb-20">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item, i) => (
            <li
              key={item.label}
              className={`transition-all duration-500 ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isOpen ? `${i * 80 + 100}ms` : "0ms" }}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group flex items-baseline gap-8 py-4 border-b border-[#faf8f5]/10 hover:border-[#faf8f5]/30 transition-colors duration-300"
                >
                  <span className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[#faf8f5] group-hover:text-[#c8c0b0] transition-colors duration-300 leading-none">
                    {item.label}
                  </span>
                  <span className="hidden md:block text-sm text-[#faf8f5]/30 group-hover:text-[#faf8f5]/50 transition-colors duration-300 font-light tracking-wide">
                    {item.description}
                  </span>
                </a>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-8 py-4 border-b border-[#faf8f5]/10 hover:border-[#faf8f5]/30 transition-colors duration-300"
                >
                  <span className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[#faf8f5] group-hover:text-[#c8c0b0] transition-colors duration-300 leading-none">
                    {item.label}
                  </span>
                  <span className="hidden md:block text-sm text-[#faf8f5]/30 group-hover:text-[#faf8f5]/50 transition-colors duration-300 font-light tracking-wide">
                    {item.description}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom bar */}
      <div className="px-8 md:px-14 py-7 flex items-center justify-between border-t border-[#faf8f5]/10">
        <p className="text-xs text-[#faf8f5]/30 tracking-widest uppercase font-light">
          © {new Date().getFullYear()} Goliath Investment Group
        </p>
        <p className="text-xs text-[#faf8f5]/30 tracking-widest uppercase font-light">
          Investment Research
        </p>
      </div>
    </div>
  );
}
