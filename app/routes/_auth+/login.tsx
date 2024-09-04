import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AlertCircle } from "lucide-react";

import Button from "@/components/Button";
import { cn } from "@/utils/ui-helper";

import { SocialLogin } from "./__social";

export const meta: MetaFunction = () => {
  return [{ title: "Sign in - Remix Start" }];
};

export default function SignInPage() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <div className="mt-7 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block font-bold text-2xl text-gray-800 dark:text-white">Sign in</h1>
            <p className="mt-3 text-gray-600 text-sm dark:text-gray-300">
              Don&apos;t have an account yet?{" "}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:underline focus:outline-none dark:text-primary-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
          <div className="mt-5 lg:mt-7">
            {/* Form */}
            <form>
              <div className="grid gap-y-4">
                {/* Form Group */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative flex flex-col gap-1">
                    <label htmlFor="email" className="font-medium text-sm text-white">
                      Email Address
                    </label>
                    <div className="relative flex flex-col">
                      <input
                        type="email"
                        placeholder="somebody@example.com"
                        className="block w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:ring-gray-600"
                        required
                      />
                      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                        <AlertCircle className={cn("hidden", "size-5 text-red-500")} />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 hidden text-red-600 text-xs" id="email-error">
                    Please include a valid email address
                  </p>
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <div className="relative flex flex-col gap-1">
                    <label htmlFor="password" className="font-medium text-sm text-white">
                      Password
                    </label>
                    <div className="relative flex flex-col">
                      <input
                        type="password"
                        placeholder="************"
                        className="block w-full rounded-lg border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:ring-gray-600"
                        required
                      />
                      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                        <AlertCircle className={cn("hidden", "size-5 text-red-500")} />
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 hidden text-red-600 text-xs" id="password-error">
                    8+ characters required
                  </p>
                </div>
                {/* End Form Group */}
                {/* Checkbox */}
                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="pointer-events-none mt-0.5 shrink-0 rounded border-gray-200 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-800 dark:checked:border-primary-500 dark:checked:bg-primary-500"
                    />
                  </div>
                  <div className="inline-flex w-full items-center justify-between">
                    <div className="ms-2.5">
                      <label htmlFor="remember-me" className="text-sm dark:text-white">
                        Remember me
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <Link
                        to="#"
                        className="text-primary-600 text-sm decoration-2 hover:underline dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </div>
                {/* End Checkbox */}
                <Button type="submit" variant="primary">
                  Continue
                </Button>
              </div>
            </form>
            {/* End Form */}
            <SocialLogin label="Or, login with" />
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link to="/" className="text-sm hover:underline dark:text-white">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
