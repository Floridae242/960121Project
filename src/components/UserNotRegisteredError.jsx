import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function UserNotRegisteredError({ redirectTo = "/login" }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 p-6">
      <div className="max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-amber-950">Please sign in first</h1>
        <p className="mt-2 text-sm text-amber-800">
          Booking is available for registered users only. Sign in to continue.
        </p>
        <Button asChild className="mt-4 bg-amber-700 hover:bg-amber-800">
          <Link to={redirectTo}>Go to login</Link>
        </Button>
      </div>
    </main>
  );
}
