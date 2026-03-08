import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline";
};

export const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  variant = "primary",
}: ButtonProps) => {
  const base =
    "py-4 px-6.5 text-lg leading-[1.1] rounded-[46px] transition-colors";

  const variants = {
    primary: "bg-[#BCEC30] text-black hover:bg-[#C6FF00] active:bg-[#BCEC30]",
    outline:
      "border border-black text-black hover:bg-[#F7F7F7] active:bg-[#E9ECED]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
