// @vitest-environment jsdom
//
// Covers src/components/docs/ThemeToggle.tsx (previously 0%):
//  - fixed variant: pre-mount placeholder, mounted aria-label/title per theme,
//    click toggles dark -> light and light -> dark via setTheme
//  - icon variant: pre-mount placeholder, mounted aria-label per theme,
//    click toggles theme in both directions
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const setThemeMock = vi.fn();
let resolvedTheme = "light";
let mountedEffectEnabled = true;

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme, setTheme: setThemeMock }),
}));

// The component gates rendering on a mount effect to avoid hydration
// mismatches. Suppressing the effect lets tests reach the pre-mount branch.
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useEffect: (fn: () => void, deps?: unknown[]) => {
      if (!mountedEffectEnabled) return;
      return actual.useEffect(fn, deps);
    },
  };
});

import { ThemeToggle } from "@/components/docs/ThemeToggle";

beforeEach(() => {
  setThemeMock.mockReset();
  resolvedTheme = "light";
  mountedEffectEnabled = true;
});

afterEach(() => {
  cleanup();
});

describe("ThemeToggle fixed variant", () => {
  it("renders a non-interactive placeholder before mount", () => {
    mountedEffectEnabled = false;
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Toggle theme" });
    expect(btn.getAttribute("title")).toBeNull();
    fireEvent.click(btn);
    expect(setThemeMock).not.toHaveBeenCalled();
  });

  it("switches to dark mode from light", () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Switch to dark mode" });
    expect(btn.getAttribute("title")).toBe("Switch to dark mode");
    fireEvent.click(btn);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("switches to light mode from dark", () => {
    resolvedTheme = "dark";
    render(<ThemeToggle />);
    const btn = screen.getByRole("button", { name: "Switch to light mode" });
    fireEvent.click(btn);
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});

describe("ThemeToggle icon variant", () => {
  it("renders a non-interactive placeholder before mount", () => {
    mountedEffectEnabled = false;
    render(<ThemeToggle variant="icon" />);
    const btn = screen.getByRole("button", { name: "Toggle theme" });
    fireEvent.click(btn);
    expect(setThemeMock).not.toHaveBeenCalled();
  });

  it("switches to dark mode from light", () => {
    render(<ThemeToggle variant="icon" />);
    const btn = screen.getByRole("button", { name: "Switch to dark mode" });
    expect(btn.getAttribute("title")).toBe("Change theme");
    fireEvent.click(btn);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("switches to light mode from dark", () => {
    resolvedTheme = "dark";
    render(<ThemeToggle variant="icon" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to light mode" })
    );
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});
