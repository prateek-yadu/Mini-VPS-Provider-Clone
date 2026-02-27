import Branding from "../../branding.json";
import { RegisterForm } from "../../components/RegisterForm";

export default function Login() {
    const appName = Branding.AppName; // gets app name from @/src/branding.json
    return (
        <div className="grid grid-cols-2 h-screen bg-accent/[1%] ">
            <div className="flex flex-col">
                {/* Branding */}
                <h2 className="logo font-semibold text-xl text-accent py-8 px-12">{appName}</h2>

                <div className="w-[45%] m-auto">
                    {/* Register Form  */}
                    <RegisterForm />
                </div>
            </div>

            <div className="bg-accent"></div>

        </div>
    );
}
