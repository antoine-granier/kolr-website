// Configuration centralisée pour AdSense
// Modifiez ce fichier pour contrôler où les annonces apparaissent

export const adsConfig = {
  // Activer/désactiver globalement les annonces
  enabled: true,

  // Publisher ID AdSense
  publisherId: "ca-pub-1962397436964429",

  // Configuration par page
  pages: {
    home: {
      enabled: true,
      adSlots: {
        betweenSections: "1234567890", // Annonce entre Tools et CTA
      },
    },
    blog: {
      enabled: true,
      adSlots: {
        afterArticles: "1234567891", // Annonce après la liste d'articles
      },
    },
    blogArticle: {
      enabled: true,
      adSlots: {
        inArticle: "1234567892", // Annonce au milieu de l'article
      },
    },
    features: {
      enabled: false, // Pas d'annonces sur la page Features
    },
    download: {
      enabled: false, // Pas d'annonces sur la page Download
    },
    about: {
      enabled: false, // Pas d'annonces sur la page About
    },
    tools: {
      enabled: false, // ⚠️ DÉSACTIVÉ pour l'approbation initiale
      // 💡 PHASE 2 : Activez APRÈS approbation AdSense (2-3 semaines)
      // enabled: true,
      // adSlots: {
      //   randomPalette: "XXXXX", // Sous le générateur
      //   contrastChecker: "XXXXX", // Sous les résultats
      //   imageExtract: "XXXXX", // Après upload
      //   colorHarmony: "XXXXX", // Sous la palette
      // },
    },
    // Privacy et Terms sont automatiquement exclus
  },
};

// Helper pour vérifier si les annonces sont activées pour une page
export function isAdEnabled(page: keyof typeof adsConfig.pages): boolean {
  return adsConfig.enabled && (adsConfig.pages[page]?.enabled ?? false);
}

// Helper pour obtenir un ad slot
export function getAdSlot(
  page: keyof typeof adsConfig.pages,
  slot: string,
): string | null {
  if (!isAdEnabled(page)) return null;
  const pageConfig = adsConfig.pages[page] as Record<string, unknown>;
  const adSlots = pageConfig?.adSlots as Record<string, string> | undefined;
  return adSlots?.[slot] ?? null;
}
