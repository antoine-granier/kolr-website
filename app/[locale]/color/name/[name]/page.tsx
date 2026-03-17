"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const COLOR_NAMES: Record<string, string> = {
  // Reds
  red: "#FF0000", "dark-red": "#8B0000", crimson: "#DC143C", firebrick: "#B22222",
  maroon: "#800000", "fire-red": "#FF3300", cherry: "#DE3163", raspberry: "#E30B5C",
  wine: "#722F37", burgundy: "#800020", ruby: "#E0115F",
  // Oranges
  orange: "#FFA500", "dark-orange": "#FF8C00", "burnt-orange": "#CC5500",
  "sunset-orange": "#FD5E53", coral: "#FF7F50", salmon: "#FA8072",
  tomato: "#FF6347", peach: "#FFCBA4", apricot: "#FBCEB1",
  // Yellows
  yellow: "#FFFF00", gold: "#FFD700", amber: "#FFBF00", honey: "#EB9605",
  mustard: "#FFDB58", khaki: "#F0E68C", "light-yellow": "#FFFFE0",
  lemonchiffon: "#FFFACD", cornsilk: "#FFF8DC", cream: "#FFFDD0",
  // Greens
  green: "#008000", "dark-green": "#006400", "forest-green": "#228B22",
  "sea-green": "#2E8B57", "spring-green": "#00FF7F", "lime-green": "#32CD32",
  lime: "#00FF00", "olive-green": "#6B8E23", olive: "#808000",
  emerald: "#50C878", jade: "#00A86B", mint: "#3EB489", sage: "#BCB88A",
  moss: "#8A9A5B", pine: "#01796F",
  // Cyans
  cyan: "#00FFFF", teal: "#008080", aqua: "#00FFFF", turquoise: "#40E0D0",
  "light-blue": "#ADD8E6",
  // Blues
  blue: "#0000FF", "dark-blue": "#00008B", navy: "#000080",
  "royal-blue": "#4169E1", "sky-blue": "#87CEEB", "steel-blue": "#4682B4",
  "powder-blue": "#B0E0E6", "midnight-blue": "#191970",
  cobalt: "#0047AB", sapphire: "#0F52BA", indigo: "#4B0082",
  // Purples
  purple: "#800080", violet: "#EE82EE", "dark-purple": "#301934",
  "light-purple": "#D8BFD8", plum: "#DDA0DD", orchid: "#DA70D6",
  magenta: "#FF00FF", fuchsia: "#FF00FF", lavender: "#E6E6FA",
  lilac: "#C8A2C8", mauve: "#E0B0FF", periwinkle: "#CCCCFF",
  thistle: "#D8BFD8",
  // Pinks
  pink: "#FFC0CB", "hot-pink": "#FF69B4", "deep-pink": "#FF1493",
  "light-pink": "#FFB6C1", "rose-gold": "#B76E79",
  // Browns
  brown: "#A52A2A", chocolate: "#D2691E", sienna: "#A0522D",
  peru: "#CD853F", tan: "#D2B48C", wheat: "#F5DEB3",
  taupe: "#483C32", espresso: "#3C1414", mocha: "#967969",
  caramel: "#FFD59A", cinnamon: "#D2691E", rust: "#B7410E",
  copper: "#B87333", bronze: "#CD7F32", terracotta: "#E2725B",
  // Grays
  gray: "#808080", grey: "#808080", "dark-gray": "#A9A9A9",
  "light-gray": "#D3D3D3", silver: "#C0C0C0", charcoal: "#36454F",
  slate: "#708090", pewter: "#96A8A1", platinum: "#E5E4E2",
  // Whites & Off-whites
  white: "#FFFFFF", ivory: "#FFFFF0", beige: "#F5F5DC", linen: "#FAF0E6",
  snow: "#FFFAFA", seashell: "#FFF5EE", oldlace: "#FDF5E6",
  floralwhite: "#FFFAF0", ghostwhite: "#F8F8FF", aliceblue: "#F0F8FF",
  azure: "#F0FFFF", mintcream: "#F5FFFA", honeydew: "#F0FFF0",
  mistyrose: "#FFE4E1", bisque: "#FFE4C4", moccasin: "#FFE4B5",
  papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", champagne: "#F7E7CE",
  sand: "#C2B280",
  // Blacks
  black: "#000000", "jet-black": "#0A0A0A", onyx: "#353839",
  // Special
  strawberry: "#FC5A8D", blush: "#DE5D83",
};

export default function ColorNamePage() {
  const params = useParams();
  const name = (params.name as string).toLowerCase();
  const locale = useLocale();
  const router = useRouter();

  const hex = COLOR_NAMES[name];

  useEffect(() => {
    if (hex) {
      router.replace(`/${locale}/color/${hex.replace("#", "")}`);
    }
  }, [hex, locale, router]);

  if (!hex) {
    return (
      <div className="bg-kolr-bg text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold">Color not found</p>
        <p className="text-kolr-text-muted">
          &quot;{name.replace(/-/g, " ")}&quot; is not in our database.
        </p>
        <a
          href={`/${locale}/gallery`}
          className="text-kolr-cyan hover:underline mt-4"
        >
          Browse the gallery instead
        </a>
      </div>
    );
  }

  return (
    <div className="bg-kolr-bg text-white min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-kolr-text-muted">Redirecting...</div>
    </div>
  );
}
