import TeamCard from "./TeamCard";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* Page label — consistent with all other pages */}
      <div className="flex flex-col items-center pt-36 pb-10">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] font-light">
          Team
        </span>
        <div className="w-px h-16 bg-[#d4cfc8] mt-4" />
      </div>

      {/* Mission statement — before the person */}
      <div className="max-w-2xl mx-auto px-8 text-center pb-20">
        <p className="font-serif text-2xl md:text-3xl font-light text-[#1a1a2e] leading-relaxed tracking-tight">
          Goliath Investment Group started as a way to stay accountable and informed — a commitment to doing the work the market demands.
        </p>
        <p className="mt-6 text-sm text-[#9ca3af] font-light leading-relaxed max-w-lg mx-auto">
          Research is the backbone of not only an investor, but of knowledge as a whole. Every opinion should be earned through evidence.
        </p>
      </div>

      {/* Thin divider */}
      <div className="max-w-xs mx-auto border-t border-[#e8e4de] mb-20" />

      {/* Team card */}
      <div className="flex justify-center px-8 pb-32">
        <TeamCard />
      </div>

    </div>
  );
}
