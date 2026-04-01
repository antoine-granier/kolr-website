/**
 * Kolr Export - Palette export formatters
 */

const KolrExport = (() => {

  function generate(colors, format) {
    switch (format) {
      case "css":
        return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
      case "tailwind":
        return `// tailwind.config.js\ncolors: {\n  palette: {\n${colors.map((c, i) => `    '${i + 1}': '${c}',`).join("\n")}\n  }\n}`;
      case "scss":
        return colors.map((c, i) => `$color-${i + 1}: ${c};`).join("\n");
      case "json":
        return JSON.stringify(
          { palette: colors.reduce((acc, c, i) => ({ ...acc, [`color${i + 1}`]: c }), {}) },
          null, 2
        );
      case "figma":
        return JSON.stringify({
          "kolr-palette": Object.fromEntries(
            colors.map((c, i) => {
              const [r, g, b] = KolrColors.hexToRgb(c);
              return [`color-${i + 1}`, {
                "$type": "color",
                "$value": `rgba(${r}, ${g}, ${b}, 1)`,
                "$description": `Palette color ${i + 1}`
              }];
            })
          )
        }, null, 2);
      default:
        return colors.join("\n");
    }
  }

  const formats = [
    { id: "css", label: "CSS Variables" },
    { id: "tailwind", label: "Tailwind" },
    { id: "scss", label: "SCSS" },
    { id: "json", label: "JSON" },
    { id: "figma", label: "Figma Tokens" },
  ];

  return { generate, formats };

})();
