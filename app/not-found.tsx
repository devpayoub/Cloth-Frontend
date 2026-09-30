import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs uppercase tracking-widest text-neutral-500">
        Page not found
      </p>
      <p className="font-display text-9xl tracking-[0.2em] text-neutral-200">
        404
      </p>
      <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
        The page you're looking for has been moved, sold out, or never existed.
      </p>
      <Link
        href="/"
        className="border border-black bg-black px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
      >
        Back to Home
      </Link>
    </section>
  );
}
