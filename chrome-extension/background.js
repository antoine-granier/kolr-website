/**
 * Kolr Background Service Worker
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pick-color") {
    startPicker(message.tabId);
    return false;
  }

  if (message.action === "capture-screenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }).then(url => {
      sendResponse({ screenshotUrl: url });
    }).catch(() => {
      sendResponse({ screenshotUrl: null });
    });
    return true; // async response
  }

  if (message.action === "pick-result" && message.color) {
    const hex = message.color.toLowerCase();
    chrome.storage.local.set({ kolr_last_picked: hex });
    chrome.storage.local.get("kolr_recent_colors").then(data => {
      let recent = data.kolr_recent_colors || [];
      recent = recent.filter(c => c !== hex);
      recent.unshift(hex);
      recent = recent.slice(0, 20);
      chrome.storage.local.set({ kolr_recent_colors: recent });
    });
    chrome.action.setBadgeBackgroundColor({ color: "#2effb0" });
    chrome.action.setBadgeText({ text: "✓" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2000);
    return false;
  }
});

async function startPicker(tabId) {
  try {
    // Capture screenshot
    const screenshotUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });

    // Inject picker overlay
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content/picker-overlay.js"],
    });

    // Send screenshot to the picker
    await chrome.tabs.sendMessage(tabId, {
      action: "kolr-show-picker",
      screenshotUrl,
    });
  } catch (err) {
    console.error("Picker failed:", err);
  }
}
