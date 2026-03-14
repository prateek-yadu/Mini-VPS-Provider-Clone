import type { ReactNode } from "react";

interface LableParams {
  children: ReactNode;
  htmlFor: string;
  className?: string;
  variant?: "sm";
}

export default function Label({
  children,
  htmlFor,
  className,
  variant,
}: LableParams) {
  let variantValue: string;

  // can add multiple variants here
  switch (variant) {
    case "sm":
      variantValue = "text-sm";
      break;

    default:
      variantValue = "text-base";
      break;
  }

  return (
    <label htmlFor={htmlFor} className={`${variantValue} ${className}`}>
      {children}
    </label>
  );
}
