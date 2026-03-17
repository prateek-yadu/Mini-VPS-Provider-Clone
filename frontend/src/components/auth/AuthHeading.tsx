import { type ReactNode } from "react";

interface AuthHeading {
  children: ReactNode;
}

export default function AuthHeading({ children }: AuthHeading) {
  return (
    <h1 className="font-semibold text-2xl lg:text-3xl text-primary ">
      {children}
    </h1>
  );
}
