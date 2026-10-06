import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Privacy } from "@/routes/privacy";
import { Terms } from "@/routes/terms";

vi.mock("@typeroute/router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}));

describe("Legal pages", () => {
  test("terms renders heading, toc and cross-links", () => {
    render(<Terms />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of Service" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Table of contents" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  test("privacy renders heading, toc and cross-links", () => {
    render(<Privacy />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Table of contents" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
  });
});
