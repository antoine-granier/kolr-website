"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  Type,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ToolContent from "@/components/ToolContent";

// --- Curated palette database ---
type Palette = [string, string, string, string, string];

const DB: Record<string, Palette> = {
  // Emotions EN
  love: ["#590D22", "#800F2F", "#A4133C", "#FF4D6D", "#FFB3C1"],
  passion: ["#6A040F", "#9D0208", "#D00000", "#E85D04", "#FAA307"],
  anger: ["#3C0000", "#6A040F", "#9D0208", "#D00000", "#FF2E2E"],
  rage: ["#2B0000", "#5C0000", "#8B0000", "#C0392B", "#E74C3C"],
  calm: ["#D4E8F0", "#A8D5E2", "#7EC8C8", "#5AAFA5", "#2E8B82"],
  peace: ["#E8F4F8", "#B2DFDB", "#80CBC4", "#4DB6AC", "#009688"],
  serenity: ["#E0F0FF", "#B3D9F7", "#86C1ED", "#5AA9E3", "#2E91D9"],
  joy: ["#FFF176", "#FFD54F", "#FFCA28", "#FFB300", "#FF8F00"],
  happy: ["#FFF9C4", "#FFF176", "#FFEE58", "#FFCA28", "#FFB300"],
  sad: ["#1A1A2E", "#16213E", "#0F3460", "#2C3E6B", "#4A5A8A"],
  melancholy: ["#1C1C3C", "#2D2D5E", "#3E3E80", "#5959A0", "#7A7ABF"],
  anxiety: ["#2C1810", "#4A3728", "#6B5A4E", "#8D7B6E", "#A89888"],
  energy: ["#FF4500", "#FF6D00", "#FF9100", "#FFAB00", "#FFC400"],
  mystery: ["#1A0033", "#2D0057", "#4A0080", "#6A1B9A", "#9C27B0"],
  romantic: ["#590D22", "#800F2F", "#C77DFF", "#E0AAFF", "#F7CAD0"],
  cozy: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#D7CCC8"],
  fresh: ["#E0F7FA", "#80DEEA", "#26C6DA", "#00ACC1", "#006064"],
  elegant: ["#0D0D0D", "#1A1A1A", "#2D2D2D", "#8C7A6B", "#C9B99A"],
  luxury: ["#1A1A0E", "#2D2B14", "#5C4B1F", "#B8860B", "#FFD700"],
  horror: ["#0A0000", "#1A0505", "#3D0C0C", "#8B0000", "#A52A2A"],
  fear: ["#0D001A", "#1A0033", "#2D004D", "#4A0080", "#6A1B9A"],
  hope: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFE082", "#FFD54F"],
  nostalgic: ["#8B7355", "#A0855C", "#C4A35A", "#D4B483", "#E8D5B7"],
  dreamy: ["#E8D5F5", "#D4B8EA", "#C09BDF", "#A77ED4", "#8E62C8"],
  powerful: ["#1B0000", "#3C0000", "#6A040F", "#C41E3A", "#DC143C"],
  soft: ["#FFF0F5", "#FFE4E8", "#FFD6DD", "#FFC2CC", "#FFAEBB"],
  warm: ["#5C2202", "#8B4513", "#CD853F", "#DEB887", "#FFE4C4"],
  cold: ["#E3F2FD", "#90CAF9", "#42A5F5", "#1976D2", "#0D47A1"],
  dark: ["#050505", "#0A0A0A", "#121212", "#1A1A1A", "#222222"],
  light: ["#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD"],
  vibrant: ["#FF0044", "#FF6600", "#FFCC00", "#00CC66", "#0066FF"],
  muted: ["#A8A29E", "#B8AFA9", "#C8C0B4", "#D8D0C4", "#E8E0D4"],
  lonely: ["#1A1A2E", "#1E2A3A", "#253545", "#354555", "#4A5A6A"],
  wild: ["#FF2D00", "#FF6600", "#228B22", "#1B4332", "#3D1C02"],
  gentle: ["#FFF0F5", "#FDDDE6", "#FFC0CB", "#FFB6C1", "#F9A8C8"],
  fierce: ["#2D0000", "#5C0000", "#8B0000", "#B22222", "#FF2222"],
  playful: ["#FF6B6B", "#FFC94C", "#6BCB77", "#4D96FF", "#C07FEB"],
  // Nature EN
  sunset: ["#FF6B35", "#F7931E", "#FBB03B", "#A4508B", "#5F0A87"],
  sunrise: ["#FF7B54", "#FFB26B", "#FFD56B", "#939B62", "#61764B"],
  dawn: ["#2C3E50", "#546E7A", "#FFA07A", "#FFD1A4", "#FFFACD"],
  dusk: ["#2C1654", "#4A2080", "#7B52AB", "#C49BBB", "#E8CECD"],
  twilight: ["#1A0533", "#2E1065", "#5526A0", "#8752C9", "#B88ADE"],
  ocean: ["#003545", "#006D77", "#0097A7", "#00ACC1", "#80DEEA"],
  sea: ["#004E64", "#007A8A", "#00A5B0", "#25C8D6", "#83E8EC"],
  wave: ["#003B46", "#07575B", "#66A5AD", "#C4DFE6", "#F0F8FF"],
  forest: ["#1B4332", "#2D6A4F", "#40916C", "#52B788", "#95D5B2"],
  jungle: ["#0B3D0B", "#1B5E20", "#2E7D32", "#388E3C", "#66BB6A"],
  desert: ["#C19A6B", "#D2B48C", "#DEB887", "#F5DEB3", "#FAEBD7"],
  sahara: ["#8B6914", "#C19A6B", "#D2B48C", "#EDC9AF", "#FAE7D0"],
  oasis: ["#006D5B", "#00897B", "#26A69A", "#80CBC4", "#E0F2F1"],
  mountain: ["#37474F", "#546E7A", "#78909C", "#90A4AE", "#CFD8DC"],
  volcano: ["#1A0A00", "#3D1C02", "#8B2500", "#CC3700", "#FF4500"],
  flower: ["#FFB7C5", "#FF69B4", "#FF1493", "#C71585", "#8B008B"],
  garden: ["#2E7D32", "#4CAF50", "#81C784", "#A5D6A7", "#E8F5E9"],
  meadow: ["#558B2F", "#7CB342", "#9CCC65", "#C5E1A5", "#F1F8E9"],
  sky: ["#87CEEB", "#6BB3E0", "#4F97D5", "#3A7CC9", "#2561BE"],
  night: ["#0A0A1A", "#0D0D2B", "#12123D", "#1A1A55", "#25256E"],
  snow: ["#F0F4F8", "#E8ECF0", "#DCE4EC", "#CBD5E1", "#94A3B8"],
  ice: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#00BCD4"],
  glacier: ["#D6ECF0", "#A8D8E8", "#7BC4DF", "#4DB0D6", "#2096CC"],
  fire: ["#FF0000", "#FF4500", "#FF6600", "#FF8C00", "#FFD700"],
  flame: ["#FFD700", "#FF8C00", "#FF6600", "#FF4500", "#CC0000"],
  earth: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#BCAAA4"],
  mud: ["#3E2723", "#4E342E", "#5D4037", "#6D4C41", "#795548"],
  autumn: ["#8B2500", "#CC5500", "#D2691E", "#CD853F", "#FFD700"],
  fall: ["#8B2500", "#CC5500", "#D2691E", "#CD853F", "#FFD700"],
  spring: ["#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50"],
  summer: ["#FFD54F", "#FFB74D", "#FF8A65", "#E57373", "#64B5F6"],
  winter: ["#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#455A64"],
  rain: ["#37474F", "#455A64", "#607D8B", "#78909C", "#90A4AE"],
  storm: ["#0D1117", "#1A2332", "#263238", "#37474F", "#CFD8DC"],
  thunder: ["#1A1A2E", "#0D0D2B", "#4A0080", "#FFD700", "#FFEB3B"],
  lightning: ["#0D0D2B", "#1A1A55", "#FFEB3B", "#FFD700", "#FFC107"],
  sun: ["#FF8F00", "#FFA000", "#FFB300", "#FFCA28", "#FFD54F"],
  moon: ["#0D0D2B", "#1A1A55", "#C0C0D8", "#E8E8F0", "#F5F5FF"],
  star: ["#0D0D2B", "#1A1A55", "#FFD700", "#FFF176", "#FFFDE7"],
  aurora: ["#0D2137", "#0E4D64", "#0EBFA0", "#2ECC71", "#7D3C98"],
  cloud: ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#90A4AE", "#78909C"],
  rainbow: ["#FF0000", "#FF8C00", "#FFFF00", "#00CC00", "#0000FF"],
  coral: ["#FF6F61", "#FF8A75", "#FFA589", "#FFBF9D", "#FFD9B1"],
  reef: ["#006064", "#00838F", "#0097A7", "#26C6DA", "#80DEEA"],
  fog: ["#D5D8DC", "#C5C8CC", "#B5B8BC", "#A5A8AC", "#95989C"],
  mist: ["#E8EDF2", "#D8DDE2", "#C8CDD2", "#B8BDC2", "#A8ADB2"],
  // Animals
  flamingo: ["#FF69B4", "#FF85C8", "#FFA0D8", "#FFB6E4", "#FFD1EE"],
  peacock: ["#004D40", "#00695C", "#00897B", "#1DE9B6", "#A7FFEB"],
  panther: ["#0A0A0A", "#1A1A2E", "#2D2D4E", "#3D3D6E", "#4D4D8E"],
  tiger: ["#FF8C00", "#E67E00", "#CC6600", "#1A1A0E", "#0D0D05"],
  butterfly: ["#9C27B0", "#AB47BC", "#CE93D8", "#E1BEE7", "#F3E5F5"],
  dolphin: ["#0277BD", "#0288D1", "#039BE5", "#29B6F6", "#81D4FA"],
  // Materials
  gold: ["#B8860B", "#DAA520", "#FFD700", "#FFDF50", "#FFF8DC"],
  silver: ["#708090", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#F5F5F5"],
  copper: ["#6E3A18", "#8B4513", "#B87333", "#D4956A", "#EDC9AF"],
  bronze: ["#614E1A", "#8C7225", "#CD9632", "#DEB068", "#F0D0A0"],
  wood: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#D7CCC8"],
  marble: ["#F5F5F5", "#ECECEC", "#E0E0E0", "#D5D5D5", "#C0C0C0"],
  velvet: ["#2C003E", "#4A0066", "#6A0088", "#8E24AA", "#CE93D8"],
  silk: ["#FFF0F5", "#F8E8EE", "#F0D5E0", "#E8C2D2", "#E0AFC4"],
  leather: ["#2C1810", "#3E2723", "#5D4037", "#795548", "#8D6E63"],
  crystal: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5"],
  diamond: ["#E8EDF2", "#D0D8E2", "#B8C4D2", "#F0F0FF", "#FFFFFF"],
  rust: ["#5C2202", "#7A3300", "#A0522D", "#B8651A", "#D4956A"],
  stone: ["#696969", "#808080", "#A9A9A9", "#BEBEBE", "#D3D3D3"],
  sand: ["#C2B280", "#D2C290", "#E0D2A0", "#EDE2B0", "#FAF0C8"],
  glass: ["#E0F0FF", "#D0E8F8", "#C0E0F0", "#B0D8E8", "#A0D0E0"],
  neon: ["#FF00FF", "#FF1493", "#00FFFF", "#39FF14", "#FFFF00"],
  // Places
  beach: ["#F5DEB3", "#FFE4B5", "#87CEEB", "#00CED1", "#006994"],
  city: ["#1C1C2E", "#2D2D4E", "#4A4A6A", "#8B8BA0", "#C5C5D0"],
  tokyo: ["#FF1493", "#FF69B4", "#1A1A2E", "#E0E0E0", "#FF4444"],
  paris: ["#2C3E50", "#C39BD3", "#F5B7B1", "#FAE5D3", "#F9E79F"],
  space: ["#0B0B1A", "#0D0D2B", "#1A1A55", "#4A0080", "#7B1FA2"],
  cosmos: ["#0A0A1A", "#1A0A3E", "#2E1065", "#7B1FA2", "#CE93D8"],
  galaxy: ["#0D001A", "#1A0033", "#4A0080", "#7B52AB", "#D1C4E9"],
  cafe: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#D7CCC8"],
  cabin: ["#3E2723", "#5D4037", "#6D4C41", "#A1887F", "#F5E6D0"],
  castle: ["#2C2C2C", "#4A4A4A", "#707070", "#A0A0A0", "#D0D0D0"],
  temple: ["#8B6914", "#B8860B", "#DAA520", "#F5DEB3", "#FAEBD7"],
  underwater: ["#001F3F", "#003366", "#005580", "#008080", "#00B4D8"],
  // Styles & Eras
  retro: ["#E8573A", "#F0A500", "#F5E6CA", "#2E7D32", "#1A5276"],
  vintage: ["#C19A6B", "#D2B48C", "#8B7D6B", "#5D4E37", "#3E2723"],
  modern: ["#212121", "#424242", "#00BCD4", "#EEEEEE", "#FAFAFA"],
  futuristic: ["#0D1117", "#1A2332", "#00BCD4", "#76FF03", "#E0E0E0"],
  minimal: ["#FAFAFA", "#F0F0F0", "#E0E0E0", "#1A1A1A", "#000000"],
  maximalist: ["#FF0044", "#FF6600", "#9C27B0", "#00BCD4", "#FFD700"],
  pastel: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"],
  cyberpunk: ["#0D0D2B", "#FF00FF", "#00FFFF", "#39FF14", "#FF1493"],
  steampunk: ["#3E2723", "#5D4037", "#8B6914", "#B8860B", "#CD853F"],
  gothic: ["#0A0A0A", "#1A1A1A", "#2D002D", "#4A004A", "#8B008B"],
  bohemian: ["#C19A6B", "#D4956A", "#E8A87C", "#D4796B", "#C44D58"],
  tropical: ["#00897B", "#26A69A", "#FFD54F", "#FF7043", "#E91E63"],
  arctic: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#B0BEC5", "#ECEFF1"],
  candy: ["#FF69B4", "#FF85C8", "#FFA0D8", "#FFD700", "#FF6EB4"],
  synthwave: ["#1A0A3E", "#FF00FF", "#00FFFF", "#FF6EC7", "#7B2FBE"],
  vaporwave: ["#FF71CE", "#B967FF", "#01CDFE", "#05FFA1", "#FFFB96"],
  artdeco: ["#1A1A0E", "#2D2B14", "#B8860B", "#DAA520", "#F5DEB3"],
  renaissance: ["#5D2906", "#8B4513", "#B22222", "#DAA520", "#F5F5DC"],
  baroque: ["#3E1C0A", "#6B3A0A", "#8B6914", "#CD853F", "#FAEBD7"],
  industrial: ["#1C1C1C", "#2D2D2D", "#4A4A4A", "#6E6E6E", "#9E9E9E"],
  zen: ["#F5F5F0", "#E8E4D8", "#C8C0A8", "#808060", "#505040"],
  grunge: ["#2C2416", "#3E3428", "#524A3A", "#6B604C", "#847860"],
  punk: ["#1A1A1A", "#FF0055", "#FFD700", "#000000", "#FFFFFF"],
  hippie: ["#FF6347", "#FFD700", "#32CD32", "#1E90FF", "#9370DB"],
  "80s": ["#FF00FF", "#00FFFF", "#FF6EC7", "#FFD700", "#7B2FBE"],
  "90s": ["#008080", "#FF6347", "#DAA520", "#800080", "#008B8B"],
  y2k: ["#FF69B4", "#C0C0C0", "#87CEEB", "#FFB6C1", "#E6E6FA"],
  // Food & Drink
  chocolate: ["#2C1810", "#3E2723", "#5D4037", "#795548", "#A1887F"],
  coffee: ["#2C1810", "#3E2723", "#6F4E37", "#A0755A", "#D2B48C"],
  espresso: ["#1C0E05", "#2C1810", "#3E2723", "#5D4037", "#8D6E63"],
  caramel: ["#5C3A1E", "#8B6914", "#C19A6B", "#DAA520", "#F5DEB3"],
  cinnamon: ["#3E1C0A", "#5C2E14", "#8B4513", "#A0522D", "#CD853F"],
  mint: ["#E0F7F0", "#B2DFDB", "#80CBC4", "#4DB6AC", "#26A69A"],
  lavender: ["#E6E6FA", "#D8BFD8", "#C8A2C8", "#B57EDC", "#9370DB"],
  cherry: ["#5C0029", "#8B0040", "#CC0044", "#E8004D", "#FF1A66"],
  lemon: ["#FFFACD", "#FFF44F", "#FFEF00", "#FFD700", "#FFCC00"],
  lime: ["#CCFF00", "#AADD00", "#88BB00", "#669900", "#447700"],
  peach: ["#FFE5B4", "#FFDAB9", "#FFCBA4", "#FFB899", "#FFA07A"],
  berry: ["#4A0033", "#6A0048", "#8B005C", "#AB1470", "#CC2288"],
  wine: ["#2C0022", "#4A0033", "#722F37", "#8B3A62", "#C77D8A"],
  champagne: ["#F7E7CE", "#F1DDCA", "#EBD3C0", "#E5C9B6", "#DFBFAC"],
  honey: ["#8B6914", "#B8860B", "#DAA520", "#F0C040", "#FFD700"],
  matcha: ["#3C5A14", "#4A6E1E", "#5B8228", "#6E9B3E", "#8BBF58"],
  vanilla: ["#FFF8DC", "#FAEBD7", "#F5DEB3", "#FFE4C4", "#FFDAB9"],
  strawberry: ["#8B0035", "#C41E54", "#E83670", "#FF6B8A", "#FF9EB0"],
  blueberry: ["#1A1040", "#2E1F5E", "#46307C", "#5F449A", "#8060B8"],
  mango: ["#FF8C00", "#FFA030", "#FFB452", "#FFC878", "#FFDCA0"],
  watermelon: ["#006400", "#2E8B20", "#FF1744", "#FF5252", "#FFB3B0"],
  avocado: ["#2E4A1A", "#3E5E24", "#507030", "#6A8A3C", "#8AA44A"],
  // FR keywords
  amour: ["#590D22", "#800F2F", "#A4133C", "#FF4D6D", "#FFB3C1"],
  soleil: ["#FF8F00", "#FFA000", "#FFB300", "#FFCA28", "#FFD54F"],
  mer: ["#003545", "#006D77", "#0097A7", "#00ACC1", "#80DEEA"],
  nuit: ["#0A0A1A", "#0D0D2B", "#12123D", "#1A1A55", "#25256E"],
  "forêt": ["#1B4332", "#2D6A4F", "#40916C", "#52B788", "#95D5B2"],
  printemps: ["#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50"],
  "été": ["#FFD54F", "#FFB74D", "#FF8A65", "#E57373", "#64B5F6"],
  automne: ["#8B2500", "#CC5500", "#D2691E", "#CD853F", "#FFD700"],
  hiver: ["#B0BEC5", "#90A4AE", "#78909C", "#607D8B", "#455A64"],
  plage: ["#F5DEB3", "#FFE4B5", "#87CEEB", "#00CED1", "#006994"],
  ciel: ["#87CEEB", "#6BB3E0", "#4F97D5", "#3A7CC9", "#2561BE"],
  feu: ["#FF0000", "#FF4500", "#FF6600", "#FF8C00", "#FFD700"],
  terre: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#BCAAA4"],
  neige: ["#F0F4F8", "#E8ECF0", "#DCE4EC", "#CBD5E1", "#94A3B8"],
  doux: ["#FFF0F5", "#FFE4E8", "#FFD6DD", "#FFC2CC", "#FFAEBB"],
  sombre: ["#050505", "#0A0A0A", "#121212", "#1A1A1A", "#222222"],
  lumineux: ["#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD"],
  chaud: ["#5C2202", "#8B4513", "#CD853F", "#DEB887", "#FFE4C4"],
  froid: ["#E3F2FD", "#90CAF9", "#42A5F5", "#1976D2", "#0D47A1"],
  joie: ["#FFF176", "#FFD54F", "#FFCA28", "#FFB300", "#FF8F00"],
  triste: ["#1A1A2E", "#16213E", "#0F3460", "#2C3E6B", "#4A5A8A"],
  "rêve": ["#E8D5F5", "#D4B8EA", "#C09BDF", "#A77ED4", "#8E62C8"],
  "énergie": ["#FF4500", "#FF6D00", "#FF9100", "#FFAB00", "#FFC400"],
  "mystère": ["#1A0033", "#2D0057", "#4A0080", "#6A1B9A", "#9C27B0"],
  luxe: ["#1A1A0E", "#2D2B14", "#5C4B1F", "#B8860B", "#FFD700"],
  nature: ["#1B4332", "#2D6A4F", "#81C784", "#AED581", "#F1F8E9"],
  fleur: ["#FFB7C5", "#FF69B4", "#FF1493", "#C71585", "#8B008B"],
  rose: ["#FFE0E8", "#FFB6C1", "#FF69B4", "#FF1493", "#C71585"],
  violet: ["#4A0080", "#6A1B9A", "#8E24AA", "#AB47BC", "#CE93D8"],
  bleu: ["#0D47A1", "#1565C0", "#1976D2", "#42A5F5", "#90CAF9"],
  vert: ["#1B5E20", "#2E7D32", "#4CAF50", "#81C784", "#C8E6C9"],
  rouge: ["#5C0000", "#8B0000", "#B22222", "#DC143C", "#FF4444"],
  jaune: ["#F9A825", "#FBC02D", "#FFEB3B", "#FFF176", "#FFF9C4"],
  orange: ["#BF360C", "#E64A19", "#FF5722", "#FF8A65", "#FFCCBC"],
  noir: ["#000000", "#0A0A0A", "#121212", "#1A1A1A", "#222222"],
  blanc: ["#FFFFFF", "#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0"],
  "océan": ["#003545", "#006D77", "#0097A7", "#00ACC1", "#80DEEA"],
  montagne: ["#37474F", "#546E7A", "#78909C", "#90A4AE", "#CFD8DC"],
  jardin: ["#2E7D32", "#4CAF50", "#81C784", "#A5D6A7", "#E8F5E9"],
  "désert": ["#C19A6B", "#D2B48C", "#DEB887", "#F5DEB3", "#FAEBD7"],
  lune: ["#0D0D2B", "#1A1A55", "#C0C0D8", "#E8E8F0", "#F5F5FF"],
  "étoile": ["#0D0D2B", "#1A1A55", "#FFD700", "#FFF176", "#FFFDE7"],
  orage: ["#0D1117", "#1A2332", "#263238", "#37474F", "#CFD8DC"],
  pluie: ["#37474F", "#455A64", "#607D8B", "#78909C", "#90A4AE"],
  volcan: ["#1A0A00", "#3D1C02", "#8B2500", "#CC3700", "#FF4500"],
  glace: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#00BCD4"],
  sable: ["#C2B280", "#D2C290", "#E0D2A0", "#EDE2B0", "#FAF0C8"],
  velours: ["#2C003E", "#4A0066", "#6A0088", "#8E24AA", "#CE93D8"],
  soie: ["#FFF0F5", "#F8E8EE", "#F0D5E0", "#E8C2D2", "#E0AFC4"],
  cuir: ["#2C1810", "#3E2723", "#5D4037", "#795548", "#8D6E63"],
  acier: ["#424242", "#616161", "#757575", "#9E9E9E", "#BDBDBD"],
  "doré": ["#B8860B", "#DAA520", "#FFD700", "#FFDF50", "#FFF8DC"],
  "argenté": ["#708090", "#A9A9A9", "#C0C0C0", "#D3D3D3", "#F5F5F5"],
  // Emotions extra
  desire: ["#8B0000", "#B22222", "#DC143C", "#FF4D6D", "#FF8FA3"],
  pride: ["#4A0080", "#6A1B9A", "#FFD700", "#FFF176", "#FFFDE7"],
  trust: ["#0D47A1", "#1976D2", "#42A5F5", "#90CAF9", "#BBDEFB"],
  curiosity: ["#FF6F00", "#FFA000", "#FFD54F", "#4FC3F7", "#0288D1"],
  freedom: ["#87CEEB", "#E0F7FA", "#FFF9C4", "#FFD54F", "#FF8F00"],
  nostalgia: ["#8B7355", "#A0855C", "#C4A35A", "#D4B483", "#E8D5B7"],
  tenderness: ["#FDDDE6", "#FFC0CB", "#FFB6C1", "#E8A0B0", "#D08090"],
  gratitude: ["#FFD54F", "#FFF176", "#C8E6C9", "#A5D6A7", "#81C784"],
  wonder: ["#1A237E", "#283593", "#3F51B5", "#7986CB", "#FFD700"],
  euphoria: ["#FF1744", "#FF4081", "#FF80AB", "#FFD54F", "#76FF03"],
  boredom: ["#9E9E9E", "#BDBDBD", "#D5D5D5", "#E0E0E0", "#EEEEEE"],
  excitement: ["#FF3D00", "#FF6E40", "#FFAB40", "#FFD740", "#EEFF41"],
  confusion: ["#4A4A6A", "#6A6A8A", "#8A8AAA", "#AAAACC", "#CCCCEE"],
  strength: ["#1B1B1B", "#3E2723", "#5D4037", "#8B4513", "#D4A76A"],
  creativity: ["#FF6F00", "#E91E63", "#9C27B0", "#2196F3", "#4CAF50"],
  innocence: ["#FFF8F0", "#FFE0E8", "#E8F5E9", "#E3F2FD", "#FFF9C4"],
  courage: ["#B71C1C", "#D32F2F", "#F44336", "#FFD700", "#212121"],
  // Nature extra
  waterfall: ["#006994", "#0097A7", "#00BCD4", "#E0F7FA", "#FFFFFF"],
  river: ["#1565C0", "#1976D2", "#42A5F5", "#90CAF9", "#E3F2FD"],
  lake: ["#004D40", "#00695C", "#00897B", "#4DB6AC", "#B2DFDB"],
  pond: ["#2E7D32", "#388E3C", "#4DB6AC", "#80CBC4", "#E0F2F1"],
  cliff: ["#5D4037", "#795548", "#8D6E63", "#A1887F", "#BCAAA4"],
  canyon: ["#BF360C", "#E64A19", "#FF5722", "#D2691E", "#FAEBD7"],
  prairie: ["#558B2F", "#7CB342", "#9CCC65", "#C5E1A5", "#FFF9C4"],
  savanna: ["#8B6914", "#C19A6B", "#D2B48C", "#87CEEB", "#228B22"],
  swamp: ["#1B3D1A", "#2E4A2D", "#3E5E3C", "#5D7A58", "#8B9A6B"],
  moss: ["#2E4A1A", "#3E5E24", "#507030", "#6A8A3C", "#8AA44A"],
  bamboo: ["#2E7D32", "#4CAF50", "#81C784", "#C8E6C9", "#F1F8E9"],
  sakura: ["#FFB7C5", "#FF93AC", "#FF69B4", "#FFE0EC", "#FFF0F5"],
  sunflower: ["#F9A825", "#FBC02D", "#FFEB3B", "#4CAF50", "#2E7D32"],
  daisy: ["#FFFFFF", "#FFFDE7", "#FFF9C4", "#FFEB3B", "#4CAF50"],
  tulip: ["#E91E63", "#F06292", "#F48FB1", "#2E7D32", "#81C784"],
  rose_flower: ["#8B0000", "#B22222", "#FF0044", "#FF4D6D", "#2E7D32"],
  palm: ["#1B5E20", "#2E7D32", "#4CAF50", "#87CEEB", "#FFD54F"],
  cactus: ["#2E7D32", "#388E3C", "#66BB6A", "#C19A6B", "#87CEEB"],
  mushroom: ["#5D4037", "#795548", "#8D6E63", "#D7CCC8", "#F5F5DC"],
  leaf: ["#1B5E20", "#2E7D32", "#4CAF50", "#81C784", "#C8E6C9"],
  petal: ["#FF80AB", "#FF4081", "#F50057", "#C51162", "#880E4F"],
  vine: ["#1B5E20", "#2E7D32", "#388E3C", "#4CAF50", "#66BB6A"],
  fog_morning: ["#D5D8DC", "#C5C8CC", "#E8EDF2", "#F0F4F8", "#FAFAFA"],
  dew: ["#E0F7FA", "#B2EBF2", "#80DEEA", "#C8E6C9", "#F1F8E9"],
  // Animals extra
  wolf: ["#424242", "#616161", "#757575", "#9E9E9E", "#BDBDBD"],
  fox: ["#BF360C", "#E64A19", "#FF5722", "#FF8A65", "#FFFFFF"],
  owl: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#FFD54F"],
  eagle: ["#212121", "#424242", "#8B6914", "#DAA520", "#87CEEB"],
  cat: ["#212121", "#424242", "#FF8F00", "#FFA726", "#FFE0B2"],
  parrot: ["#00C853", "#FFD600", "#FF3D00", "#2962FF", "#AA00FF"],
  swan: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#0D47A1", "#1565C0"],
  whale: ["#003545", "#006D77", "#0097A7", "#37474F", "#546E7A"],
  jellyfish: ["#E040FB", "#CE93D8", "#BA68C8", "#00BCD4", "#80DEEA"],
  snake: ["#1B5E20", "#2E7D32", "#4CAF50", "#8B6914", "#3E2723"],
  lion: ["#8B6914", "#C19A6B", "#DAA520", "#3E2723", "#1B1B1B"],
  bear: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#1B4332"],
  horse: ["#3E2723", "#5D4037", "#8B4513", "#C19A6B", "#F5DEB3"],
  deer: ["#5D4037", "#795548", "#A1887F", "#1B4332", "#2E7D32"],
  unicorn: ["#FF69B4", "#CE93D8", "#B388FF", "#82B1FF", "#FFFFFF"],
  dragon: ["#B71C1C", "#D32F2F", "#1A1A1A", "#FFD700", "#2E7D32"],
  phoenix: ["#FF0000", "#FF4500", "#FF8C00", "#FFD700", "#FFE082"],
  // Food extra
  sushi: ["#FFFFFF", "#FFA07A", "#FF6347", "#2E7D32", "#1A1A1A"],
  pizza: ["#BF360C", "#E64A19", "#FFCA28", "#8BC34A", "#F5F5DC"],
  croissant: ["#DAA520", "#D2B48C", "#DEB887", "#FAEBD7", "#FFF8DC"],
  macaron: ["#FFB6C1", "#E6E6FA", "#B2EBF2", "#C8E6C9", "#FFF9C4"],
  cookie: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#3E2723"],
  cake: ["#FF69B4", "#FFB6C1", "#FFFFFF", "#FFD700", "#F5DEB3"],
  tea: ["#2E7D32", "#8B6914", "#C19A6B", "#D2B48C", "#F5F5DC"],
  smoothie: ["#E91E63", "#FF6F00", "#FFEB3B", "#4CAF50", "#AB47BC"],
  mojito: ["#00C853", "#69F0AE", "#B9F6CA", "#FFFFFF", "#795548"],
  sangria: ["#4A0033", "#8B005C", "#B22222", "#FF6347", "#FFD700"],
  truffle: ["#1C0E05", "#2C1810", "#3E2723", "#5D4037", "#8D6E63"],
  pistachio: ["#6B8E23", "#8BC34A", "#C5E1A5", "#F5F5DC", "#795548"],
  coconut: ["#F5F5DC", "#FFFFFF", "#8B4513", "#2E7D32", "#87CEEB"],
  ginger: ["#BF360C", "#E64A19", "#FF5722", "#FF8A65", "#FFCCBC"],
  wasabi: ["#7CB342", "#8BC34A", "#9CCC65", "#C5E1A5", "#F1F8E9"],
  // Places extra
  venice: ["#0D47A1", "#1976D2", "#FFD700", "#FAEBD7", "#8B0000"],
  morocco: ["#BF360C", "#E64A19", "#0D47A1", "#FFD700", "#F5F5DC"],
  iceland: ["#37474F", "#546E7A", "#90CAF9", "#E3F2FD", "#FFFFFF"],
  hawaii: ["#00BCD4", "#26A69A", "#FFD54F", "#FF7043", "#E91E63"],
  japan: ["#D32F2F", "#FFFFFF", "#1A1A1A", "#FFB7C5", "#2E7D32"],
  india: ["#FF6F00", "#E91E63", "#FFD600", "#2E7D32", "#1565C0"],
  greece: ["#0D47A1", "#FFFFFF", "#FFC107", "#FF5722", "#4DB6AC"],
  egypt: ["#8B6914", "#DAA520", "#FFD700", "#D2B48C", "#0D47A1"],
  brazil: ["#2E7D32", "#FFEB3B", "#0D47A1", "#FF6F00", "#F5F5DC"],
  scotland: ["#1B5E20", "#4A0080", "#FF8C00", "#795548", "#78909C"],
  bali: ["#1B5E20", "#00BCD4", "#FFD54F", "#FF7043", "#F5F5DC"],
  sahel: ["#C19A6B", "#D2B48C", "#DEB887", "#8B6914", "#2E7D32"],
  tundra: ["#B0BEC5", "#CFD8DC", "#ECEFF1", "#78909C", "#455A64"],
  // Textures extra
  denim: ["#1A237E", "#283593", "#3F51B5", "#5C6BC0", "#C5CAE9"],
  wool: ["#F5F5DC", "#E8E4D8", "#D2C8B0", "#B8A888", "#9E8C6C"],
  cotton: ["#FFFFFF", "#FAFAFA", "#F5F5F5", "#E0E0E0", "#BDBDBD"],
  linen: ["#FAF0E6", "#F5E6D0", "#E8D5B7", "#D2C290", "#B8A870"],
  ceramic: ["#E8E4D8", "#D2C8B0", "#C19A6B", "#4A6741", "#1B4332"],
  porcelain: ["#FFFFFF", "#F8F8FF", "#F0F0F5", "#E8E8ED", "#D0D0D8"],
  concrete: ["#9E9E9E", "#BDBDBD", "#CFD8DC", "#78909C", "#455A64"],
  brick: ["#8B2500", "#A0522D", "#B8652A", "#CC7A3F", "#E0A070"],
  terracotta: ["#C04000", "#D4652F", "#E88A5E", "#F0A880", "#F8D0B0"],
  mosaic: ["#0D47A1", "#E91E63", "#FFD600", "#00BCD4", "#4CAF50"],
  stained_glass: ["#B71C1C", "#1565C0", "#FFD600", "#2E7D32", "#6A1B9A"],
  // Music
  jazz: ["#1A1A2E", "#FFD700", "#8B4513", "#CD853F", "#F5F5DC"],
  blues: ["#0D1B2A", "#1B2838", "#2E4057", "#4A7AB5", "#6BA3D6"],
  rock: ["#1A1A1A", "#2D2D2D", "#B22222", "#DC143C", "#FFD700"],
  metal: ["#0A0A0A", "#1A1A1A", "#424242", "#757575", "#B22222"],
  reggae: ["#2E7D32", "#FFD600", "#B71C1C", "#1A1A1A", "#FF6F00"],
  classical: ["#3E2723", "#5D4037", "#DAA520", "#F5F5DC", "#FFFFFF"],
  electronic: ["#0D0D2B", "#FF00FF", "#00FFFF", "#39FF14", "#1A1A55"],
  lofi: ["#5D4037", "#795548", "#A1887F", "#C8B8A8", "#E8D8C8"],
  acoustic: ["#5D4037", "#8B6914", "#C19A6B", "#F5DEB3", "#F5F5DC"],
  hiphop: ["#1A1A1A", "#FFD700", "#FF0044", "#FFFFFF", "#C0C0C0"],
  rnb: ["#1A0033", "#4A0080", "#9C27B0", "#CE93D8", "#FFD700"],
  punk_music: ["#1A1A1A", "#FF0055", "#FF3388", "#FFD700", "#FFFFFF"],
  soul: ["#3E2723", "#5D4037", "#8B4513", "#DAA520", "#FFD700"],
  disco: ["#FF00FF", "#FF4081", "#FFD700", "#C0C0C0", "#00BCD4"],
  ambient: ["#0D1117", "#1A2332", "#263238", "#37474F", "#546E7A"],
  // Seasons extra
  "indian summer": ["#BF360C", "#E64A19", "#FF8F00", "#FFD54F", "#4CAF50"],
  monsoon: ["#263238", "#37474F", "#546E7A", "#78909C", "#006064"],
  harvest: ["#8B6914", "#C19A6B", "#DAA520", "#CC5500", "#2E7D32"],
  blossom: ["#FFB7C5", "#FF93AC", "#FF69B4", "#81C784", "#4CAF50"],
  frost: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#CFD8DC", "#FFFFFF"],
  // Misc
  meditation: ["#4A148C", "#6A1B9A", "#CE93D8", "#E1BEE7", "#F3E5F5"],
  yoga: ["#00695C", "#00897B", "#26A69A", "#B2DFDB", "#F5F5DC"],
  wellness: ["#00897B", "#26A69A", "#80CBC4", "#FFF9C4", "#FFF176"],
  magic: ["#1A0033", "#4A0080", "#9C27B0", "#FFD700", "#00BCD4"],
  fairy: ["#E1BEE7", "#CE93D8", "#FF80AB", "#FFCC80", "#A5D6A7"],
  witch: ["#1A0033", "#2D004D", "#4A0080", "#8BC34A", "#FF6F00"],
  pirate: ["#1A1A1A", "#3E2723", "#8B0000", "#DAA520", "#FFFFFF"],
  royal: ["#1A0033", "#4A0080", "#FFD700", "#B22222", "#FFFFFF"],
  princess: ["#FFB6C1", "#FF69B4", "#CE93D8", "#FFD700", "#FFFFFF"],
  warrior: ["#1A1A1A", "#424242", "#8B0000", "#C0C0C0", "#FFD700"],
  samurai: ["#1A1A1A", "#B22222", "#DAA520", "#FFFFFF", "#2E7D32"],
  ninja: ["#0A0A0A", "#1A1A1A", "#2D2D2D", "#424242", "#B22222"],
  wedding: ["#FFFFFF", "#F5F5F5", "#FFD700", "#FFB6C1", "#E8E8E8"],
  birthday: ["#FF4081", "#FFD740", "#448AFF", "#69F0AE", "#E040FB"],
  christmas: ["#B71C1C", "#2E7D32", "#FFD700", "#FFFFFF", "#8B0000"],
  halloween: ["#FF6F00", "#1A1A1A", "#6A1B9A", "#4CAF50", "#FFD700"],
  valentine: ["#880E4F", "#C2185B", "#E91E63", "#F48FB1", "#FFE0E8"],
  // FR extra
  paradis: ["#00BCD4", "#26A69A", "#81C784", "#FFD54F", "#FFFFFF"],
  enfer: ["#1A0000", "#4A0000", "#8B0000", "#FF0000", "#FF4500"],
  "rivière": ["#1565C0", "#1976D2", "#42A5F5", "#90CAF9", "#E3F2FD"],
  cascade: ["#006994", "#0097A7", "#00BCD4", "#E0F7FA", "#FFFFFF"],
  prairie_fr: ["#558B2F", "#7CB342", "#9CCC65", "#C5E1A5", "#FFF9C4"],
  campagne: ["#558B2F", "#7CB342", "#87CEEB", "#FFD54F", "#F5F5DC"],
  vendange: ["#4A0033", "#722F37", "#8B3A62", "#DAA520", "#2E7D32"],
  brume: ["#D5D8DC", "#C5C8CC", "#B5B8BC", "#A5A8AC", "#95989C"],
  aurore: ["#FF7043", "#FFB74D", "#FFF176", "#CE93D8", "#42A5F5"],
  "crépuscule": ["#2C1654", "#4A2080", "#7B52AB", "#C49BBB", "#E8CECD"],
  tempête: ["#0D1117", "#1A2332", "#263238", "#37474F", "#CFD8DC"],
  papillon: ["#9C27B0", "#AB47BC", "#CE93D8", "#E1BEE7", "#F3E5F5"],
  loup: ["#424242", "#616161", "#757575", "#9E9E9E", "#BDBDBD"],
  renard: ["#BF360C", "#E64A19", "#FF5722", "#FF8A65", "#FFFFFF"],
  hibou: ["#3E2723", "#5D4037", "#795548", "#A1887F", "#FFD54F"],
  aigle: ["#212121", "#424242", "#8B6914", "#DAA520", "#87CEEB"],
  licorne: ["#FF69B4", "#CE93D8", "#B388FF", "#82B1FF", "#FFFFFF"],
  sirène: ["#006064", "#00838F", "#00BCD4", "#80DEEA", "#CE93D8"],
  magie: ["#1A0033", "#4A0080", "#9C27B0", "#FFD700", "#00BCD4"],
  "fée": ["#E1BEE7", "#CE93D8", "#FF80AB", "#FFCC80", "#A5D6A7"],
  "Noël": ["#B71C1C", "#2E7D32", "#FFD700", "#FFFFFF", "#8B0000"],
  "mariage": ["#FFFFFF", "#F5F5F5", "#FFD700", "#FFB6C1", "#E8E8E8"],
  "anniversaire": ["#FF4081", "#FFD740", "#448AFF", "#69F0AE", "#E040FB"],
};

// Compound phrases (checked first, higher priority)
const COMPOUNDS: Record<string, Palette> = {
  "coucher de soleil": ["#FF6B35", "#F7931E", "#FBB03B", "#A4508B", "#5F0A87"],
  "lever de soleil": ["#FF7B54", "#FFB26B", "#FFD56B", "#939B62", "#61764B"],
  "clair de lune": ["#0D0D2B", "#1A1A55", "#B8B8D0", "#D8D8E8", "#F0F0FF"],
  "nuit étoilée": ["#0A0A1A", "#0D0D3A", "#1A1A55", "#DAA520", "#FFD700"],
  "fond marin": ["#001F3F", "#003366", "#005580", "#008080", "#00B4D8"],
  "fleur de cerisier": ["#FFB7C5", "#FF93AC", "#FF69B4", "#FFE0EC", "#FFF0F5"],
  "aurore boréale": ["#0D2137", "#0E4D64", "#0EBFA0", "#2ECC71", "#7D3C98"],
  "heure dorée": ["#FF8C00", "#FFA500", "#FFB740", "#FFD080", "#FFF0C0"],
  "jour de pluie": ["#37474F", "#455A64", "#607D8B", "#78909C", "#90A4AE"],
  "nuit noire": ["#000000", "#050510", "#0A0A1A", "#0F0F2A", "#14143A"],
  "ciel bleu": ["#87CEEB", "#6BB3E0", "#4F97D5", "#3A7CC9", "#2561BE"],
  "rose bonbon": ["#FF69B4", "#FF85C8", "#FFA0D8", "#FFB6E4", "#FFD1EE"],
  "bleu nuit": ["#0A0A2A", "#0D0D3A", "#12124D", "#1A1A60", "#252575"],
  "vert sapin": ["#0B3D0B", "#1B4332", "#2D6A4F", "#1C5F30", "#0E3B1A"],
  "rouge sang": ["#2B0000", "#4A0000", "#6A0000", "#8B0000", "#B22222"],
  "luxe doré": ["#1A1A0E", "#2D2B14", "#5C4B1F", "#B8860B", "#FFD700"],
  "or rose": ["#B76E79", "#C08090", "#D4A0A8", "#E8C0C8", "#F5E0E5"],
  "arc-en-ciel": ["#FF0000", "#FF8C00", "#FFFF00", "#00CC00", "#0000FF"],
  "arc en ciel": ["#FF0000", "#FF8C00", "#FFFF00", "#00CC00", "#0000FF"],
  "deep sea": ["#001020", "#002040", "#004060", "#006080", "#0080A0"],
  "dark forest": ["#0A1A0A", "#1A2E1A", "#1B4332", "#2D5A3F", "#3D6E4C"],
  "cherry blossom": ["#FFB7C5", "#FF93AC", "#FF69B4", "#FFE0EC", "#FFF0F5"],
  "northern lights": ["#0D2137", "#0E4D64", "#0EBFA0", "#2ECC71", "#7D3C98"],
  "golden hour": ["#FF8C00", "#FFA500", "#FFB740", "#FFD080", "#FFF0C0"],
  "blue hour": ["#1A2744", "#2A3B5C", "#3A4F74", "#4A638C", "#5A78A4"],
  "old money": ["#1B3A1A", "#2D5A2C", "#3E6B3E", "#C19A6B", "#DAA520"],
  "rainy day": ["#37474F", "#455A64", "#607D8B", "#78909C", "#90A4AE"],
  "night sky": ["#0A0A1A", "#0D0D3A", "#1A1A55", "#252580", "#3030AA"],
  "dark mode": ["#0D1117", "#161B22", "#21262D", "#30363D", "#484F58"],
  "rose gold": ["#B76E79", "#C08090", "#D4A0A8", "#E8C0C8", "#F5E0E5"],
  "burnt orange": ["#5C2202", "#8B3500", "#CC5500", "#E87020", "#FF8C42"],
  "baby blue": ["#B3D9F7", "#C5E3FA", "#D7EDFC", "#E9F5FE", "#F5FAFF"],
  "royal blue": ["#001A70", "#002590", "#0030B0", "#1040D0", "#2060F0"],
  "midnight blue": ["#000020", "#000040", "#001060", "#002080", "#0030A0"],
  "hot pink": ["#FF1493", "#FF3CA5", "#FF5EB7", "#FF80C9", "#FFA2DB"],
  "sea foam": ["#A8E6CF", "#B8ECD8", "#C8F2E1", "#D8F8EA", "#E8FEF3"],
  "cotton candy": ["#FFB3D9", "#FFC2E0", "#FFD1E8", "#FFE0EF", "#FFEFF7"],
  "stormy night": ["#0A0A1A", "#141428", "#1E1E36", "#3D3D5C", "#787890"],
  "starry night": ["#0A0A1A", "#0D0D3A", "#1A1A55", "#DAA520", "#FFD700"],
  "blood red": ["#2B0000", "#4A0000", "#6A0000", "#8B0000", "#B22222"],
};

// --- Matching engine ---

function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF";
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function blendColors(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t
  );
}

interface MatchResult {
  palettes: Palette[];
  keywords: string[];
}

function findMatches(text: string): MatchResult {
  const lower = text.toLowerCase();
  const palettes: Palette[] = [];
  const keywords: string[] = [];
  let remaining = lower;

  // 1. Compound phrases first
  for (const [phrase, palette] of Object.entries(COMPOUNDS)) {
    if (lower.includes(phrase)) {
      palettes.push(palette);
      keywords.push(phrase);
      remaining = remaining.replace(phrase, " ");
    }
  }

  // 2. Single words (original + normalized)
  const words = remaining.split(/[\s,;.!?'"()-]+/).filter((w) => w.length >= 2);
  for (const word of words) {
    // Exact match
    if (DB[word]) {
      palettes.push(DB[word]);
      keywords.push(word);
      continue;
    }
    // Normalized (no accents)
    const norm = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm !== word && DB[norm]) {
      palettes.push(DB[norm]);
      keywords.push(word);
      continue;
    }
    // Partial match (min 4 chars)
    if (word.length >= 4) {
      for (const [key, palette] of Object.entries(DB)) {
        const normKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normKey.length >= 4 && (norm.includes(normKey) || normKey.includes(norm))) {
          palettes.push(palette);
          keywords.push(key);
          break;
        }
      }
    }
  }

  // Also check accented keys in original text
  for (const [key, palette] of Object.entries(DB)) {
    if (key.includes(" ")) continue;
    if (lower.includes(key) && !keywords.includes(key)) {
      palettes.push(palette);
      keywords.push(key);
    }
  }

  return { palettes, keywords: [...new Set(keywords)] };
}

// --- Palette generation ---

interface HarmonyResult {
  name: string;
  colors: string[];
}

// Shift hue of a hex color by degrees
function shiftHue(hex: string, degrees: number): string {
  const [r, g, b] = hexToRgb(hex);
  // RGB to HSL
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rf) h = ((gf - bf) / d + (gf < bf ? 6 : 0)) / 6;
    else if (max === gf) h = ((bf - rf) / d + 2) / 6;
    else h = ((rf - gf) / d + 4) / 6;
  }
  // Shift hue
  h = ((h * 360 + degrees) % 360 + 360) % 360;
  // HSL to RGB
  const hs = h / 360;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let rr: number, gg: number, bb: number;
  if (s === 0) { rr = gg = bb = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    rr = hue2rgb(p, q, hs + 1/3);
    gg = hue2rgb(p, q, hs);
    bb = hue2rgb(p, q, hs - 1/3);
  }
  return rgbToHex(rr * 255, gg * 255, bb * 255);
}

function generateFromPalettes(palettes: Palette[], hash: number): HarmonyResult[] {
  // Get the primary palette (first match or fallback)
  let primary: Palette;

  if (palettes.length === 0) {
    // Fallback: generate from hash
    const h = hash % 360;
    const hslToSimpleHex = (hh: number, s: number, l: number) => {
      s /= 100; l /= 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + hh / 30) % 12;
        const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    };
    primary = [
      hslToSimpleHex(h, 50, 25),
      hslToSimpleHex((h + 15) % 360, 50, 35),
      hslToSimpleHex((h + 30) % 360, 55, 45),
      hslToSimpleHex((h + 45) % 360, 45, 55),
      hslToSimpleHex((h + 60) % 360, 40, 65),
    ];
  } else {
    primary = palettes[0];
  }

  const results: HarmonyResult[] = [];

  // 1. Original — the curated palette as-is
  results.push({ name: "original", colors: [...primary] });

  // 2. Complementary — shift hue by 180°
  results.push({
    name: "complementary",
    colors: [primary[0], primary[1], shiftHue(primary[2], 180), shiftHue(primary[3], 180), shiftHue(primary[4], 180)],
  });

  // 3. Triadic — shift by 120° and 240°
  results.push({
    name: "triadic",
    colors: [primary[0], shiftHue(primary[1], 120), primary[2], shiftHue(primary[3], 240), shiftHue(primary[4], 120)],
  });

  // 4. Split complementary — shift by 150° and 210°
  results.push({
    name: "split",
    colors: [primary[0], primary[1], shiftHue(primary[2], 150), shiftHue(primary[3], 210), primary[4]],
  });

  // If multiple palettes matched, add a blend as bonus
  if (palettes.length >= 2) {
    const p2 = palettes[1];
    results.push({
      name: "blend",
      colors: [primary[0], primary[1], blendColors(primary[2], p2[2], 0.5), p2[3], p2[4]],
    });
  }

  return results;
}

// --- Suggestions ---
const SUGGESTIONS_EN = [
  "tropical sunset",
  "cozy winter night",
  "ocean breeze",
  "cherry blossom",
  "dark mystery",
  "neon cyberpunk",
  "vintage cafe",
  "spring garden",
  "golden hour",
  "arctic aurora",
];

const SUGGESTIONS_FR = [
  "coucher de soleil tropical",
  "nuit d'hiver cozy",
  "brise de l'océan",
  "fleur de cerisier",
  "mystère sombre",
  "néon cyberpunk",
  "café vintage",
  "jardin de printemps",
  "luxe doré",
  "aurore boréale",
];

// --- Component ---
export default function TextPalettePage() {
  const t = useTranslations("nav");
  const tTool = useTranslations("toolTextPalette");
  const locale = useLocale();

  const [text, setText] = useState("");
  const [harmonies, setHarmonies] = useState<HarmonyResult[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);

  const harmonyLabels: Record<string, string> = {
    original: tTool("analogous"),
    complementary: tTool("complementary"),
    triadic: tTool("triadic"),
    split: tTool("split"),
    blend: "Blend",
  };

  const suggestions = locale === "fr" ? SUGGESTIONS_FR : SUGGESTIONS_EN;

  const generate = useCallback((input: string) => {
    if (!input.trim()) return;
    const trimmed = input.trim();
    const hash = hashText(trimmed);
    const { palettes, keywords } = findMatches(trimmed);
    const results = generateFromPalettes(palettes, hash);
    setHarmonies(results);
    setMatchedKeywords(keywords.slice(0, 6));
  }, []);

  const copyColor = useCallback((hex: string, key: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }, []);

  return (
    <section className="section">
      <div className="container max-w-[900px]">
        {/* Header */}
        <Reveal animation="reveal-up">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-kolr-text-muted no-underline font-semibold mb-8 transition-colors duration-200 hover:text-kolr-cyan w-fit"
          >
            <ArrowLeft size={18} />
            <span>{t("home")}</span>
          </Link>

          <header className="mb-12 text-center">
            <h1 className="[font-size:_clamp(2.5rem,5vw,3.5rem)] font-black mb-2 tracking-[-0.02em]">
              {tTool("title")}
            </h1>
            <p className="text-kolr-text-muted text-lg">
              {tTool("description")}
            </p>
          </header>
        </Reveal>

        {/* Input */}
        <Reveal animation="reveal-up" delay={1}>
          <div className="bg-kolr-surface border border-kolr-border rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Type
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-kolr-text-muted"
                />
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") generate(text);
                  }}
                  placeholder={tTool("placeholder")}
                  className="w-full pl-11 pr-4 py-4 bg-kolr-bg border-2 border-kolr-border rounded-xl focus:border-kolr-cyan focus:ring-1 focus:ring-kolr-cyan/30 focus:outline-none transition-all text-lg"
                />
              </div>
              <button
                onClick={() => generate(text)}
                disabled={!text.trim()}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-kolr-cyan text-black rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={20} />
                {tTool("generate")}
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setText(s);
                    generate(s);
                  }}
                  className="px-3 py-1.5 bg-kolr-bg border border-kolr-border rounded-lg text-xs text-kolr-text-muted hover:text-kolr-cyan hover:border-kolr-cyan transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Results */}
        {harmonies.length > 0 && (
          <Reveal animation="reveal-up" delay={0}>
            <div className="mb-8">
              {/* Matched keywords */}
              {matchedKeywords.length > 0 && (
                <div className="flex items-center gap-2 mb-6 text-xs text-kolr-text-muted flex-wrap">
                  <span>{tTool("detected")}:</span>
                  {matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-kolr-cyan/10 text-kolr-cyan rounded-md"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* All palettes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {harmonies.map((harmony) => (
                  <div
                    key={harmony.name}
                    className="bg-kolr-surface border border-kolr-border rounded-2xl p-5 hover:border-kolr-cyan/30 transition-colors"
                  >
                    <h3 className="text-sm font-semibold mb-3 text-kolr-text-muted">
                      {harmonyLabels[harmony.name] || harmony.name}
                    </h3>

                    {/* Color bars */}
                    <div className="flex gap-1.5 mb-3 h-16 rounded-xl overflow-hidden">
                      {harmony.colors.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => copyColor(color, `${harmony.name}-${i}`)}
                          className="flex-1 group relative transition-all hover:flex-[2] cursor-pointer"
                          style={{ backgroundColor: color }}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: getContrastColor(color) }}
                          >
                            {copiedKey === `${harmony.name}-${i}` ? (
                              <Check size={14} />
                            ) : (
                              <Copy size={14} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Hex codes */}
                    <div className="flex gap-1.5">
                      {harmony.colors.map((color, i) => (
                        <div key={i} className="flex-1 text-center">
                          <span className="text-[10px] font-mono text-kolr-text-muted">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* SEO content */}
        <ToolContent
          aboutContent={tTool.raw("aboutContent")}
          howToContent={tTool.raw("howToContent")}
          faqJson={tTool.raw("faq")}
        />
      </div>
    </section>
  );
}
