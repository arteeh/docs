// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBackToTop } from "../hooks/useBackToTop";

/**
 * Coverage for useBackToTop, extracted from the duplicated back-to-top
 * scroll logic previously copy-pasted in Footer.tsx and DocsFooter.tsx.
 */
describe("useBackToTop", () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    button = document.createElement("button");
    button.id = "back-to-top";
    document.body.appendChild(button);
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("does nothing when the target element is missing", () => {
    document.body.innerHTML = "";
    expect(() => renderHook(() => useBackToTop())).not.toThrow();
  });

  it("toggles visibility based on scroll position", () => {
    renderHook(() => useBackToTop());

    Object.defineProperty(window, "scrollY", { value: 400, configurable: true });
    window.dispatchEvent(new Event("scroll"));
    expect(button.style.opacity).toBe("1");

    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    window.dispatchEvent(new Event("scroll"));
    expect(button.style.opacity).toBe("0");
  });

  it("smooth-scrolls to top on click", () => {
    renderHook(() => useBackToTop());
    button.dispatchEvent(new Event("click"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("removes listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useBackToTop());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("supports a custom element id", () => {
    document.body.innerHTML = "";
    const custom = document.createElement("button");
    custom.id = "custom-top";
    document.body.appendChild(custom);

    renderHook(() => useBackToTop("custom-top"));
    custom.dispatchEvent(new Event("click"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
