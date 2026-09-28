"use client";

import { useEffect } from "react";

/**
 * Wires up the "back to top" button behavior: toggles its visibility based
 * on scroll position and smooth-scrolls to the top of the page on click.
 * Extracted from Footer.tsx / DocsFooter.tsx, which duplicated this logic.
 */
export function useBackToTop(elementId: string = "back-to-top") {
  useEffect(() => {
    const backToTopButton = document.getElementById(elementId);
    if (!backToTopButton) return;

    const toggleButton = () => {
      if (window.scrollY > 300) {
        backToTopButton.style.opacity = "1";
        backToTopButton.style.transform = "translateY(-30px)";
      } else {
        backToTopButton.style.opacity = "0";
        backToTopButton.style.transform = "translateY(10px)";
      }
    };

    const handleClick = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("scroll", toggleButton);
    backToTopButton.addEventListener("click", handleClick);

    // Initial check
    toggleButton();

    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener("scroll", toggleButton);
      backToTopButton.removeEventListener("click", handleClick);
    };
  }, [elementId]);
}
