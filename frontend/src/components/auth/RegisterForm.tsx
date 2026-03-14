import { Link, Navigate } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { toast } from "sonner";
import AuthHeading from "./AuthHeading";
import AuthDescription from "./AuthDescription";
import OauthButton from "./OauthButton";
import Input from "../ui/Input";
import AuthButton from "./AuthButton";
import Label from "../ui/Label";

export function RegisterForm() {
  // gets AuthState
  const authState = useSelector((state: RootState) => state.AuthState);

  // user input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register handling logic
  const handleRegister = async (event: { preventDefault: () => void; }) => {
    try {
      event?.preventDefault();

      // sends data to DB
      const response = await (
        await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        })
      ).json();

      // clears input
      setName("");
      setEmail("");
      setPassword("");

      // shows toast
      if (response.status == 201) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (authState.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <form onSubmit={handleRegister}>
      <AuthHeading>Get started</AuthHeading>
      <AuthDescription>Create a new account</AuthDescription>

      {/* Oauth Register Option */}
      <div className="mt-12 flex flex-col w-full gap-4">
        <OauthButton>
          <span>
            <img
              src="/images/logos/google.svg"
              alt="google-logo"
              className="size-8"
            />
          </span>
          Continue with Google
        </OauthButton>
        <OauthButton>
          <span>
            <img
              src="/images/logos/github.svg"
              alt="github-logo"
              className="size-8"
            />
          </span>
          Continue with Github
        </OauthButton>
      </div>

      {/* Seprator */}
      <div className="my-5 relative flex items-center justify-center">
        <span className="text-center text-accent bg-white px-4">or</span>
        <div className="h-[1px] bg-muted/30 absolute top-3 w-full -z-10" />
      </div>

      {/* Email based Register Option */}
      <div className="pb-4">
        <Label htmlFor="name" className="block" variant="sm">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="pb-4">
        <Label htmlFor="email" className="block" variant="sm">
          Email
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="pb-1">
        <Label htmlFor="password" className="block" variant="sm">
          Password
        </Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Register Button */}
      <div className="py-8">
        <AuthButton>Register</AuthButton>
        <p className="py-8 text-sm text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-accent font-medium underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}
