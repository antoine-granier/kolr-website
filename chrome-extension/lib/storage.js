/**
 * Kolr Storage - chrome.storage.local wrapper
 */

const KolrStorage = (() => {

  async function getPalettes() {
    const result = await chrome.storage.local.get("kolr_palettes");
    return result.kolr_palettes || [];
  }

  async function savePalette(palette) {
    const palettes = await getPalettes();
    const index = palettes.findIndex(p => p.id === palette.id);
    if (index >= 0) {
      palettes[index] = palette;
    } else {
      palettes.unshift(palette);
    }
    await chrome.storage.local.set({ kolr_palettes: palettes });
  }

  async function deletePalette(id) {
    const palettes = await getPalettes();
    const filtered = palettes.filter(p => p.id !== id);
    await chrome.storage.local.set({ kolr_palettes: filtered });
  }

  async function getRecentColors() {
    const result = await chrome.storage.local.get("kolr_recent_colors");
    return result.kolr_recent_colors || [];
  }

  async function addRecentColor(hex) {
    let colors = await getRecentColors();
    colors = colors.filter(c => c !== hex);
    colors.unshift(hex);
    colors = colors.slice(0, 20);
    await chrome.storage.local.set({ kolr_recent_colors: colors });
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  return {
    getPalettes,
    savePalette,
    deletePalette,
    getRecentColors,
    addRecentColor,
    generateId,
  };

})();
