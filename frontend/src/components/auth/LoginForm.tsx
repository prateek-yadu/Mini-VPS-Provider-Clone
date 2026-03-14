import { Link, Navigate } from "react-router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthState } from "../../app/features/auth/AuthHandler";
import type { RootState } from "../../app/store";
import { toast } from "sonner";
import AuthHeading from "./AuthHeading";
import AuthDescription from "./AuthDescription";
import OauthButton from "./OauthButton";
import AuthButton from "./AuthButton";
import Input from "../ui/Input";
import Label from "../ui/Label";

export function LoginForm() {
  // gets AuthState
  const authState = useSelector((state: RootState) => state.AuthState);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: { preventDefault: () => void; }) => {
    try {
      event?.preventDefault();

      // sends data to backend
      const response = await (
        await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
      ).json();

      // clears input
      setEmail("");
      setPassword("");

      // shows toast
      if (response.status == 200) {
        // sets userdata to reducer for universal access
        dispatch(
          updateAuthState({
            isAuthenticated: true,
            name: response.data.name,
            email: response.data.email,
            imageUrl: response.data.imageUrl,
          }),
        );

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
    <form onSubmit={handleLogin}>
      <AuthHeading>Welcome back</AuthHeading>
      <AuthDescription>Log in to your account</AuthDescription>

      {/* Oauth Login Option */}
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

      {/* Email based Login Option */}
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
      <div className="py-1">
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
        <span className="block text-right text-sm text-muted hover:text-accent cursor-pointer hover:underline mt-2">
          Forgot password?
        </span>
      </div>

      {/* Login Button */}
      <div className="py-8">
        <AuthButton>Login</AuthButton>
        <p className="py-8 text-sm text-center">
          Don’t have an account?{" "}
          <Link to={"/register"} className="text-accent font-medium underline">
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}
