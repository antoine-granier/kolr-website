/**
 * Kolr Accessibility - Content script (Firefox)
 * Injects accessibility enhancements into any webpage
 */

(() => {
  const STYLE_ID = "kolr-a11y-styles";

  // Remove existing styles if any
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  document.head.appendChild(style);

  // Listen for messages from the popup
  browser.runtime.onMessage.addListener((msg) => {
    if (msg.action !== "a11y-update") return;
    applySettings(msg.settings);
    return Promise.resolve({ ok: true });
  });

  // On load, apply persisted settings
  browser.storage.local.get("kolr_a11y").then((data) => {
    if (data.kolr_a11y) applySettings(data.kolr_a11y);
  });

  function applySettings(s) {
    const rules = [];

    // Font size scaling
    if (s.fontSize && s.fontSize !== 100) {
      rules.push(`html { font-size: ${s.fontSize}% !important; }`);
    }

    // High contrast
    if (s.highContrast) {
      rules.push(`
        * {
          color: #ffffff !important;
          background-color: #000000 !important;
          border-color: #ffffff !important;
        }
        a, a * { color: #ffff00 !important; }
        img, video, canvas, svg { filter: contrast(1.5) !important; }
      `);
    }

    // Invert colors
    if (s.invertColors) {
      rules.push(`html { filter: invert(1) hue-rotate(180deg) !important; }`);
      rules.push(`img, video, canvas, [style*="background-image"] { filter: invert(1) hue-rotate(180deg) !important; }`);
    }

    // Dyslexia-friendly font
    if (s.dyslexiaFont) {
      rules.push(`
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
          font-weight: normal;
        }
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Bold.woff') format('woff');
          font-weight: bold;
        }
        * { font-family: 'OpenDyslexic', sans-serif !important; }
      `);
    }

    // Letter spacing
    if (s.letterSpacing && s.letterSpacing !== 0) {
      rules.push(`* { letter-spacing: ${s.letterSpacing}px !important; }`);
    }

    // Line height
    if (s.lineHeight && s.lineHeight !== 0) {
      rules.push(`* { line-height: ${1.5 + s.lineHeight * 0.25}em !important; }`);
    }

    // Word spacing
    if (s.wordSpacing && s.wordSpacing !== 0) {
      rules.push(`* { word-spacing: ${s.wordSpacing}px !important; }`);
    }

    // Highlight links
    if (s.highlightLinks) {
      rules.push(`
        a, a * {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 3px !important;
          outline: 2px solid #ffff00 !important;
          outline-offset: 2px !important;
          background-color: rgba(255, 255, 0, 0.15) !important;
        }
      `);
    }

    // Big cursor
    if (s.bigCursor) {
      rules.push(`
        * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M8 4 L8 36 L16 28 L26 42 L30 40 L20 26 L32 26 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 4 4, auto !important;
        }
        a, button, [role="button"], input, select, textarea {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M16 4 v36 M4 24 h24' stroke='black' stroke-width='4'/%3E%3Cpath d='M16 4 v36 M4 24 h24' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 16 24, pointer !important;
        }
      `);
    }

    // Hide images
    if (s.hideImages) {
      rules.push(`
        img, svg, video, canvas, [role="img"] {
          opacity: 0.05 !important;
        }
        [style*="background-image"] {
          background-image: none !important;
        }
      `);
    }

    // Focus indicators
    if (s.focusIndicators) {
      rules.push(`
        *:focus, *:focus-visible {
          outline: 3px solid #ff6600 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 6px rgba(255, 102, 0, 0.3) !important;
        }
      `);
    }

    // Reading guide (horizontal line that follows mouse)
    if (s.readingGuide) {
      ensureReadingGuide();
    } else {
      removeReadingGuide();
    }

    // Stop animations
    if (s.stopAnimations) {
      rules.push(`
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `);
    }

    // Saturation
    if (s.saturation !== undefined && s.saturation !== 100) {
      rules.push(`html { filter: saturate(${s.saturation / 100}) !important; }`);
    }

    style.textContent = rules.join("\n");
  }

  // Reading guide: horizontal line following mouse
  let guideEl = null;

  function ensureReadingGuide() {
    if (guideEl) return;
    guideEl = document.createElement("div");
    guideEl.id = "kolr-reading-guide";
    Object.assign(guideEl.style, {
      position: "fixed",
      left: "0",
      width: "100%",
      height: "4px",
      background: "rgba(255, 102, 0, 0.6)",
      pointerEvents: "none",
      zIndex: "2147483647",
      top: "0",
      transition: "top 0.05s linear",
      boxShadow: "0 0 12px rgba(255, 102, 0, 0.3)",
    });
    document.body.appendChild(guideEl);
    document.addEventListener("mousemove", moveGuide);
  }

  function removeReadingGuide() {
    if (guideEl) {
      guideEl.remove();
      guideEl = null;
      document.removeEventListener("mousemove", moveGuide);
    }
  }

  function moveGuide(e) {
    if (guideEl) guideEl.style.top = e.clientY + "px";
  }
})();
