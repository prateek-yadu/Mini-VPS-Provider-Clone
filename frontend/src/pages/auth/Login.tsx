import { LoginForm } from "../../components/auth/LoginForm";
import Branding from "../../branding.json";

export default function Login() {
  const appName = Branding.AppName; // gets app name from @/src/branding.json
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-accent/[1%] ">
      <div className="flex flex-col">
        {/* Branding */}
        <h2 className="logo font-semibold text-xl text-accent px-8 py-8 lg:px-12">
          {appName}
        </h2>

        <div className="w-[70%] lg:w-[60%] xl:w-[45%] m-auto">
          {/* Login Form  */}
          <LoginForm />
        </div>
      </div>

      <div className="hidden lg:flex">
        <img
          src="/images/auth.jpg"
          alt=""
          className="object-center object-cover"
        />
      </div>
    </div>
  );
}
