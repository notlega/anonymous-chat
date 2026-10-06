import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { Link } from "@typeroute/router";
import type * as React from "react";
import { Mark } from "@/components/mark";

function LegalLayout({
  title,
  intro,
  toc,
  children,
}: {
  title: string;
  intro: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-4 py-8 md:py-12">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <IconArrowNarrowLeft className="size-4" aria-hidden="true" />
          Back to chat
        </Link>
        <Mark className="size-6 text-primary" />
      </header>
      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-balance font-bold text-3xl tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground text-xs tabular-nums">
            Last updated October 7, 2026
          </p>
        </div>
        <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
          {intro}
        </p>
        <nav aria-label="Table of contents">
          <ul className="flex flex-col gap-1.5">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm underline-offset-4 hover:text-primary hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-8">{children}</div>
      </main>
      <footer className="border-border border-t pt-4 text-muted-foreground text-xs">
        Questions?{" "}
        <a
          href="mailto:contact@example.com"
          className="underline underline-offset-4 hover:text-foreground"
        >
          contact@example.com
        </a>
        {" · "}
        <Link
          to="/terms"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Terms
        </Link>
        {" · "}
        <Link
          to="/privacy"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Privacy
        </Link>
      </footer>
    </div>
  );
}

function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-6 flex-col gap-3">
      <h2 className="font-semibold text-xl tracking-tight">{title}</h2>
      <div className="flex max-w-[65ch] flex-col gap-3 break-words text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export { LegalLayout, LegalSection };
