import { Link, Navigate } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

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
      const response = await (await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, password: password })
      })).json();

      // clears input
      setName("");
      setEmail("");
      setPassword("");

      // shows toast
      if (response.status == 201) {
        console.log(response.message)
      } else if (response.status == 409) {
        console.log(response.message)
      } else {
        console.log(response.message)
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  if (authState.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <form onSubmit={handleRegister}>
      <h1 className="font-semibold text-3xl text-primary ">Get started</h1>
      <span className="my-2 text-sm text-secondary-foreground">Create a new account</span>

      {/* Oauth Register Option */}
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

      {/* Email based Register Option */}
      <div className="pb-4">
        <label htmlFor="name" className="block text-sm">Name</label>
        <input type="text" name="name" id="name" className="w-full py-1 px-3 my-1 border-[1px] rounded border-accent/20 focus:border-accent/40 outline-none bg-accent/[4%] text-sm " placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="pb-4">
        <label htmlFor="email" className="block text-sm">Email</label>
        <input type="email" name="email" id="email" className="w-full py-1 px-3 my-1 border-[1px] rounded border-accent/20 focus:border-accent/40 outline-none bg-accent/[4%] text-sm " placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="pb-1">
        <label htmlFor="password" className="block text-sm">Password</label>
        <input type="password" name="password" id="password" className="w-full py-1 px-3 my-1 border-[1px] rounded border-accent/20 focus:border-accent/40 outline-none bg-accent/[4%] text-sm " placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {/* Register Button */}
      <div className="py-8">
        <button className="bg-accent py-3 text-center w-full text-white rounded cursor-pointer hover:bg-accent/95" type="submit">Register</button>
        <p className="py-8 text-sm text-center">Already have an account? <Link to={"/login"} className="text-accent font-medium underline">Login</Link></p>
      </div>

    </form>
  );
}
