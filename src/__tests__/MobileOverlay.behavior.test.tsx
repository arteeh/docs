// @vitest-environment jsdom
//
// Covers src/components/docs/MobileOverlay.tsx (previously 0%) and the
// remaining DocsProvider branches:
//  - overlay renders nothing while the menu is closed
//  - overlay appears when the menu opens and a click closes the menu
//  - dismissBanner persists the flag to localStorage and initial state
//    reads it back
//  - useDocsMenu throws outside a DocsProvider
import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { MobileOverlay } from "@/components/docs/MobileOverlay";
import { DocsProvider, useDocsMenu } from "@/components/docs/DocsProvider";

function Controls() {
  const { menuOpen, toggleMenu, bannerDismissed, dismissBanner } =
    useDocsMenu();
  return (
    <div>
      <button onClick={toggleMenu}>menu</button>
      <button onClick={dismissBanner}>dismiss</button>
      <span data-testid="menu-state">{menuOpen ? "open" : "closed"}</span>
      <span data-testid="banner-state">
        {bannerDismissed ? "dismissed" : "shown"}
      </span>
    </div>
  );
}

function renderOverlay() {
  return render(
    <DocsProvider>
      <Controls />
      <MobileOverlay />
    </DocsProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("MobileOverlay", () => {
  it("renders nothing while the menu is closed", () => {
    const { container } = renderOverlay();
    expect(container.querySelector(".fixed.inset-0")).toBeNull();
  });

  it("appears when the menu opens and closes the menu on click", () => {
    const { container } = renderOverlay();
    fireEvent.click(screen.getByText("menu"));
    expect(screen.getByTestId("menu-state").textContent).toBe("open");

    const overlay = container.querySelector(".fixed.inset-0");
    expect(overlay).not.toBeNull();

    fireEvent.click(overlay!);
    expect(screen.getByTestId("menu-state").textContent).toBe("closed");
    expect(container.querySelector(".fixed.inset-0")).toBeNull();
  });
});

describe("DocsProvider banner state", () => {
  it("dismissBanner flips state and persists to localStorage", () => {
    renderOverlay();
    expect(screen.getByTestId("banner-state").textContent).toBe("shown");
    fireEvent.click(screen.getByText("dismiss"));
    expect(screen.getByTestId("banner-state").textContent).toBe("dismissed");
    expect(localStorage.getItem("docs-banner-dismissed")).toBe("true");
  });

  it("initializes bannerDismissed from localStorage", () => {
    localStorage.setItem("docs-banner-dismissed", "true");
    renderOverlay();
    expect(screen.getByTestId("banner-state").textContent).toBe("dismissed");
  });
});

describe("useDocsMenu outside provider", () => {
  it("throws a descriptive error", () => {
    function Bare() {
      useDocsMenu();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(
      "useDocsMenu must be used within a DocsProvider"
    );
  });
});
