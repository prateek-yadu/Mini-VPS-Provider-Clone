import { type ChangeEvent } from "react";

interface InputFields {
  type: "password" | "number" | "text" | "email";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  placeholder: string;
}

export default function Input({
  type,
  value,
  onChange,
  name,
  id,
  placeholder,
}: InputFields) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      className="w-full py-1 px-3 my-1 border-[1px] rounded border-accent/20 focus:border-accent/40 outline-none bg-accent/[4%] text-sm "
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
