import type * as React from "react";

function Mark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M9 10h14a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-7.8L10 26v-4H9a2.5 2.5 0 0 1-2.5-2.5v-7A2.5 2.5 0 0 1 9 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M11 15.5h10M11 18.5h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { Mark };
