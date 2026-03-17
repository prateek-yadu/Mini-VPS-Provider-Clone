import { type ReactNode } from "react";

interface AuthDescription {
  children: ReactNode;
}

export default function AuthDescription({ children }: AuthDescription) {
  return (
    <span className="my-2 text-sm text-secondary-foreground">{children}</span>
  );
}
