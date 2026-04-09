"use client";

import { useState } from "react";

export default function TeamCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center w-full max-w-sm">

      {/* Circle photo — click to expand */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close bio" : "Open bio"}
        className="relative group focus:outline-none"
      >
        {/* Outer ring — subtle cream border */}
        <div className="w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border border-[#e0dbd3] transition-transform duration-500 group-hover:scale-[1.03]">
          <img
            src="/images/jonathan.jpg"
            alt="Jonathan Cao"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Hint arrow — fades when open */}
        <div
          className={`absolute -bottom-5 left-1/2 -translate-x-1/2 transition-all duration-300 ${
            open ? "opacity-0 translate-y-1" : "opacity-40"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#1a1a2e]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Name + title — always visible */}
      <div className="mt-10 text-center">
        <p className="font-serif text-2xl font-light text-[#1a1a2e] tracking-tight">
          Jonathan Cao
        </p>
        <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[#9ca3af] font-light">
          Founder
        </p>
      </div>

      {/* Expandable bio panel — slides up smoothly */}
      <div
        className={`w-full overflow-hidden transition-all duration-700 ease-in-out ${
          open ? "max-h-[700px] opacity-100 mt-10" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        {/* Contact buttons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="https://www.linkedin.com/in/jonathanucao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 border border-[#1a1a2e] text-[#1a1a2e] text-xs tracking-widest uppercase font-light hover:bg-[#1a1a2e] hover:text-[#faf8f5] transition-all duration-300 rounded-none"
          >
            {/* LinkedIn icon */}
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>

          <a
            href="mailto:jucao@usc.edu"
            className="flex items-center gap-2 px-5 py-2 border border-[#1a1a2e] text-[#1a1a2e] text-xs tracking-widest uppercase font-light hover:bg-[#1a1a2e] hover:text-[#faf8f5] transition-all duration-300 rounded-none"
          >
            {/* Email icon */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Email
          </a>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-[#1a1a2e] mx-auto mb-8" />

        {/* Bio — centered */}
        <div className="text-center space-y-4 px-2">
          <p className="font-serif text-base md:text-lg font-light text-[#3a3530] leading-relaxed">
            Born and raised in Miami, Florida, Jonathan has always had a deep passion for everything business — from markets and capital to strategy and enterprise.
          </p>
          <p className="font-serif text-base md:text-lg font-light text-[#3a3530] leading-relaxed">
            After high school, he enlisted in the military and served four years before transitioning out to pursue higher education. He is now at the University of Southern California, studying Finance with a minor in AI Applications.
          </p>
          <p className="font-serif text-base md:text-lg font-light text-[#3a3530] leading-relaxed">
            Upon graduation, Jonathan will be joining Moelis & Company at their Los Angeles office.
          </p>
        </div>

        {/* Close hint */}
        <button
          onClick={() => setOpen(false)}
          className="block mx-auto mt-8 text-xs tracking-widest uppercase text-[#9ca3af] hover:text-[#1a1a2e] font-light transition-colors duration-300"
        >
          Close ↑
        </button>
      </div>

    </div>
  );
}
