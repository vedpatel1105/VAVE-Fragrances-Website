
import Link from "next/link";

export default function CheckYourEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Check Your Email</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We’ve sent a confirmation link to your inbox. Please open your email
          and click the link to verify your account before logging in.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
