import { type ReactNode } from "react";

interface AuthButton {
  children: ReactNode;
  onClick?: () => void;
}

export default function AuthButton({ children, onClick }: AuthButton) {
  return (
    <button className="bg-accent py-3 text-center w-full text-white rounded cursor-pointer hover:bg-accent/95"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
