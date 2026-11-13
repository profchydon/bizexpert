import { SidePanel } from "./SidePanel";
import { SignupForm } from "./SignupForm";

export default function NewOnboardingSignup() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-full flex-1 flex-col overflow-hidden px-8">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-[400px]">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-gray-900">
                Create your account
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Get your team up and running in under 3 minutes.
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="hidden shrink-0 lg:block lg:w-[48%]">
        <SidePanel />
      </div>
    </div>
  );
}
