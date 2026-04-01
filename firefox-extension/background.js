/**
 * Kolr Background Script (Firefox)
 */

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pick-color") {
    startPicker(message.tabId);
    return false;
  }

  if (message.action === "capture-screenshot") {
    browser.tabs.captureVisibleTab(null, { format: "png" }).then(url => {
      sendResponse({ screenshotUrl: url });
    }).catch(() => {
      sendResponse({ screenshotUrl: null });
    });
    return true; // async response
  }

  if (message.action === "pick-result" && message.color) {
    const hex = message.color.toLowerCase();
    browser.storage.local.set({ kolr_last_picked: hex });
    browser.storage.local.get("kolr_recent_colors").then(data => {
      let recent = data.kolr_recent_colors || [];
      recent = recent.filter(c => c !== hex);
      recent.unshift(hex);
      recent = recent.slice(0, 20);
      browser.storage.local.set({ kolr_recent_colors: recent });
    });
    browser.action.setBadgeBackgroundColor({ color: "#2effb0" });
    browser.action.setBadgeText({ text: "\u2713" });
    setTimeout(() => browser.action.setBadgeText({ text: "" }), 2000);
    return false;
  }

});

async function startPicker(tabId) {
  try {
    // Capture screenshot
    const screenshotUrl = await browser.tabs.captureVisibleTab(null, { format: "png" });

    // Inject picker overlay
    await browser.scripting.executeScript({
      target: { tabId },
      files: ["content/picker-overlay.js"],
    });

    // Send screenshot to the picker
    await browser.tabs.sendMessage(tabId, {
      action: "kolr-show-picker",
      screenshotUrl,
    });
  } catch (err) {
    console.error("Picker failed:", err);
  }
}
