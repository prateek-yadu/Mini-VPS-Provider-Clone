import { type ReactNode } from "react";

interface OauthButton {
  children: ReactNode;
  onClick?: () => void;
}

export default function OauthButton({ children, onClick }: OauthButton) {
  return (
    <button
      className="bg-white border border-border-primary py-3 rounded text-primary cursor-pointer hover:bg-border-primary/[1%] hover:border-primary/20 font-medium text-sm flex items-center justify-center gap-4"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
