"use client";

export const BackToTopBtn = () => {
  return (
    <button
      className="px-8 py-3 bg-[#BCEC30] rounded-[46px] text-[18px] font-medium"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Наверх ↑
    </button>
  );
};
