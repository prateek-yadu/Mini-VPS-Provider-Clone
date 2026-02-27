import { Link, Navigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthState } from "../app/features/auth/AuthHandler";
import type { RootState } from "../app/store";


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
      const response = await (await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      })).json();

      // clears input
      setEmail("");
      setPassword("");

      // shows toast
      if (response.status == 200) {
        // sets userdata to reducer for universal access 
        dispatch(updateAuthState({
          isAuthenticated: true,
          name: response.data.name,
          email: response.data.email,
          imageUrl: response.data.imageUrl
        }));

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
    <form className="" onSubmit={handleLogin}>
      <h1 className="font-semibold text-3xl text-primary ">Welcome back</h1>
      <span className="my-2 text-sm text-secondary-foreground">Log in to your account</span>

      {/* Oauth Login Option */}
      <div className="mt-12 flex flex-col w-full gap-4">
        <button className="bg-white border border-border-primary py-3 rounded text-primary cursor-pointer hover:bg-border-primary/[1%] hover:border-primary/20 font-medium text-sm flex items-center justify-center gap-4" type="button">
          <span>
            <img src="/images/logos/google.svg" alt="google-logo" className="size-8" />
          </span>
          Continue with Google</button>
        <button className="bg-white border border-border-primary py-3 rounded text-primary cursor-pointer hover:bg-border-primary/[1%] hover:border-primary/20 font-medium text-sm flex items-center justify-center gap-4" type="button">
          <span>
            <img src="/images/logos/github.svg" alt="github-logo" className="size-8" />
          </span>
          Continue with Github</button>
      </div>

      {/* Seprator */}
      <div className="my-5 relative flex items-center justify-center">
        <span className="text-center text-accent bg-white px-4">or</span>
        <div className="h-[1px] bg-muted/30 absolute top-3 w-full -z-10" />
      </div>

      {/* Email based Login Option */}
      <div className="pb-4">
        <label htmlFor="email" className="block text-sm">Email</label>
        <input type="email" name="email" id="email" className="w-full py-1 px-3 my-1 border-[1px] rounded border-accent/20 focus:border-accent/40 outline-none bg-accent/[4%] text-sm " placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="py-1">
        <label htmlFor="password" className="block text-sm">Password</label>
        <input type="password" name="password" id="password" className="w-full py-1 px-3 my-1 border-[1px] rounded border-accent/20 focus:border-accent/40 outline-none bg-accent/[4%] text-sm " placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        <span className="block text-right text-sm text-muted hover:text-accent cursor-pointer hover:underline mt-2">Forgot password?</span>
      </div>

      {/* Login Button */}
      <div className="py-8">
        <button className="bg-accent py-3 text-center w-full text-white rounded cursor-pointer hover:bg-accent/95">Login</button>
        <p className="py-8 text-sm text-center">Don’t have an account? <Link to={"/register"} className="text-accent font-medium underline">Register</Link></p>
      </div>

    </form>
  );
}
