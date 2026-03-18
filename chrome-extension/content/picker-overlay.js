/**
 * Kolr Color Picker
 * Non-blocking: user can scroll. Screenshot is retaken on scroll.
 * Magnifier floats over the page, click to pick.
 */

(() => {
  // Remove any existing picker
  document.querySelectorAll(".__kolr_picker_el").forEach(el => el.remove());

  let active = true;
  let canvas = null;
  let ctx = null;
  const dpr = window.devicePixelRatio || 1;
  let screenshotPending = false;

  // --- UI Elements ---

  // Hint bar
  const hint = document.createElement("div");
  hint.className = "__kolr_picker_el";
  hint.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:2147483647;background:#000000dd;backdrop-filter:blur(12px);color:#fff;font:600 12px system-ui;text-align:center;padding:8px 20px;pointer-events:none;border-radius:10px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 4px 20px rgba(0,0,0,0.4);display:flex;align-items:center;gap:10px;";
  hint.innerHTML = `<span style="color:#00f2ff;font-weight:800;">Kolr</span> <span style="opacity:0.4;">|</span> Click to pick <span style="opacity:0.4;">·</span> Scroll to navigate <span style="opacity:0.4;">·</span> Esc to cancel`;

  // Magnifier
  const mag = document.createElement("div");
  mag.className = "__kolr_picker_el";
  mag.style.cssText = "position:fixed;pointer-events:none;width:110px;height:110px;border-radius:50%;border:3px solid #00f2ff;box-shadow:0 0 0 2px rgba(0,0,0,0.4),0 8px 24px rgba(0,0,0,0.6);z-index:2147483647;display:none;overflow:hidden;";
  const magCanvas = document.createElement("canvas");
  magCanvas.width = 110;
  magCanvas.height = 110;
  magCanvas.style.cssText = "width:110px;height:110px;image-rendering:pixelated;";
  mag.appendChild(magCanvas);
  const magCtx = magCanvas.getContext("2d");

  // Label
  const label = document.createElement("div");
  label.className = "__kolr_picker_el";
  label.style.cssText = "position:fixed;pointer-events:none;background:#000000ee;color:#fff;font:bold 13px monospace;padding:5px 12px;border-radius:8px;z-index:2147483647;display:none;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.4);";

  // Custom cursor overlay — transparent, just for crosshair
  const cursorOverlay = document.createElement("div");
  cursorOverlay.className = "__kolr_picker_el";
  cursorOverlay.style.cssText = "position:fixed;inset:0;z-index:2147483646;cursor:crosshair;";

  document.documentElement.appendChild(hint);
  document.documentElement.appendChild(mag);
  document.documentElement.appendChild(label);
  document.documentElement.appendChild(cursorOverlay);

  // --- Screenshot management ---

  function loadScreenshot(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  }

  function requestNewScreenshot() {
    if (screenshotPending || !active) return;
    screenshotPending = true;
    chrome.runtime.sendMessage({ action: "capture-screenshot" }, (response) => {
      screenshotPending = false;
      if (!active) return;
      if (response?.screenshotUrl) {
        loadScreenshot(response.screenshotUrl).then(() => {
          stale = false;
          // Re-show magnifier at last mouse position
          updateMagnifier(lastMouseX, lastMouseY);
        });
      }
    });
  }

  // Initial screenshot from background message
  chrome.runtime.onMessage.addListener(function handler(msg) {
    if (msg.action !== "kolr-show-picker") return;
    chrome.runtime.onMessage.removeListener(handler);
    loadScreenshot(msg.screenshotUrl);
  });

  // Retake screenshot on scroll (debounced)
  let scrollTimer = null;
  let stale = false;
  function onScroll() {
    if (!active) return;
    // Hide magnifier — screenshot is outdated
    if (!stale) {
      stale = true;
      mag.style.display = "none";
      label.style.display = "none";
    }
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      requestNewScreenshot();
    }, 100);
  }
  window.addEventListener("scroll", onScroll, true);

  // --- Interaction ---

  function getHex(x, y) {
    if (!ctx) return "#000000";
    const px = ctx.getImageData(
      Math.min(Math.max(Math.round(x * dpr), 0), canvas.width - 1),
      Math.min(Math.max(Math.round(y * dpr), 0), canvas.height - 1),
      1, 1
    ).data;
    return `#${px[0].toString(16).padStart(2,"0")}${px[1].toString(16).padStart(2,"0")}${px[2].toString(16).padStart(2,"0")}`;
  }

  let lastMouseX = 0;
  let lastMouseY = 0;

  function onMove(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    if (!active || !ctx || stale) return;
    updateMagnifier(e.clientX, e.clientY);
  }

  function updateMagnifier(mx, my) {

    // Position magnifier — flip near edges
    const magX = mx + 140 > window.innerWidth ? mx - 130 : mx + 20;
    const magY = my - 140 < 30 ? my + 20 : my - 130;
    mag.style.left = magX + "px";
    mag.style.top = magY + "px";
    mag.style.display = "block";

    label.style.left = magX + "px";
    label.style.top = (magY + 115) + "px";
    label.style.display = "block";

    // Zoomed preview (10x)
    const zoom = 10;
    const srcSize = 110 / zoom;
    const sx = (mx * dpr) - (srcSize * dpr / 2);
    const sy = (my * dpr) - (srcSize * dpr / 2);

    magCtx.imageSmoothingEnabled = false;
    magCtx.clearRect(0, 0, 110, 110);
    magCtx.drawImage(canvas, sx, sy, srcSize * dpr, srcSize * dpr, 0, 0, 110, 110);

    // Crosshair
    magCtx.strokeStyle = "rgba(255,255,255,0.4)";
    magCtx.lineWidth = 1;
    magCtx.beginPath();
    magCtx.moveTo(55, 0); magCtx.lineTo(55, 110);
    magCtx.moveTo(0, 55); magCtx.lineTo(110, 55);
    magCtx.stroke();

    // Center pixel box
    const pxSize = 110 / srcSize;
    magCtx.strokeStyle = "#fff";
    magCtx.lineWidth = 2;
    magCtx.strokeRect(55 - pxSize / 2, 55 - pxSize / 2, pxSize, pxSize);

    const hex = getHex(mx, my);
    label.textContent = hex.toUpperCase();
    label.style.borderLeft = `4px solid ${hex}`;
    mag.style.borderColor = hex;
  }

  function onClick(e) {
    if (!active || !ctx) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const hex = getHex(e.clientX, e.clientY);
    cleanup();

    navigator.clipboard.writeText(hex.toUpperCase()).catch(() => {});
    chrome.runtime.sendMessage({ action: "pick-result", color: hex });

    // Toast
    const toast = document.createElement("div");
    toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2effb0;color:#000;font:bold 13px system-ui;padding:10px 20px;border-radius:10px;z-index:2147483647;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;";
    toast.innerHTML = `<span style="width:18px;height:18px;border-radius:4px;background:${hex};border:2px solid rgba(0,0,0,0.2);flex-shrink:0;"></span> Copied ${hex.toUpperCase()}`;
    document.documentElement.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

  function onKey(e) {
    if (e.key === "Escape") cleanup();
  }

  // Use cursorOverlay for mousemove and click (keeps crosshair + captures events)
  // But allow scroll to pass through by not preventing wheel events
  cursorOverlay.addEventListener("mousemove", onMove);
  cursorOverlay.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);

  // Allow scrolling through the overlay
  cursorOverlay.addEventListener("wheel", (e) => {
    // Pass the scroll to the page
    cursorOverlay.style.pointerEvents = "none";
    const target = document.elementFromPoint(e.clientX, e.clientY);
    cursorOverlay.style.pointerEvents = "auto";
    if (target) {
      target.dispatchEvent(new WheelEvent("wheel", {
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaMode: e.deltaMode,
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true,
      }));
    }
  }, { passive: true });

  function cleanup() {
    active = false;
    document.querySelectorAll(".__kolr_picker_el").forEach(el => el.remove());
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", onScroll, true);
    clearTimeout(scrollTimer);
  }
})();
