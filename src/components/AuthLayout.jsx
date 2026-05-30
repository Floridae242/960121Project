import { Link } from "react-router-dom";

import { APP_NAME, APP_SUBTITLE } from "@/lib/app-params";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white p-6">
      <div className="mx-auto max-w-md pt-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-amber-900">
          <span className="rounded-full bg-amber-900 px-2 py-1 text-xs font-semibold text-amber-50">
            {APP_SUBTITLE}
          </span>
          <span className="text-sm font-semibold">{APP_NAME}</span>
        </Link>

        <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-amber-950">{title}</h1>
          <p className="mt-2 text-sm text-amber-800">{subtitle}</p>
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-5 border-t border-amber-100 pt-4">{footer}</div> : null}
        </section>
      </div>
    </main>
  );
}
