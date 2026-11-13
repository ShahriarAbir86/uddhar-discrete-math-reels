// Animation Story style: the two approved modes. Builders import one palette: `import { PALETTES } from "../../../styles/animation-story/palette.mjs"; const P = PALETTES[MODE];`
// MODE must come from the user's answer (Light or Dark) for each new reel. Never default silently.
export const BRAND = { orange: "#F2530F", navy: "#101B49", white: "#FFFFFF", cream: "#FEEEE7", creamHover: "#FDE5DB", neutral: "#F6F6F7" };

export const PALETTES = {
  // LIGHT: brand "Light" orange-tinted surface (#FEEEE7) as the page, navy ink, white/neutral cards.
  light: {
    name: "light", bg: "#FEEEE7", bgEdge: "#FDE5DB", fibre: [190, 150, 130], paperPng: "paper_light.png",
    text: "#101B49", muted: "#5B6285", card: "#FFFFFF", cardInk: "#101B49", cardBorder: "#101B49", cardShadow: "#101B49",
    orange: "#F2530F", orangeDark: "#C23F0A", tint: "#6C74A6", lilac: "#B9BEE0",
    ground: "#555473", halftone: "#8B7F78", skylineFill: "#E6D3C8", skylineDots: "#8B7F78", windows: "#FEEEE7",
    pants: "#101B49", cap: "#101B49", skin: "#8A8EA3", subBand: "#101B49", subInk: "#FFFFFF", hud: "#7F84A3",
    endBg: "#101B49", logo: "assets/Uddhar_icon.svg",
  },
  // DARK: brand Deep Navy (#101B49) as the page, cream (#FEEEE7) cards and text, orange stays the single accent.
  dark: {
    name: "dark", bg: "#101B49", bgEdge: "#0A1033", fibre: [60, 80, 150], paperPng: "paper_dark.png",
    text: "#FEEEE7", muted: "#9AA1C8", card: "#FEEEE7", cardInk: "#101B49", cardBorder: "#0A1033", cardShadow: "#050A24",
    orange: "#F2530F", orangeDark: "#C23F0A", tint: "#6C74A6", lilac: "#B9BEE0",
    ground: "#3A4686", halftone: "#2B3A7A", skylineFill: "#1B2766", skylineDots: "#3A4686", windows: "#101B49",
    pants: "#3A4686", cap: "#3A4686", skin: "#8A8EA3", subBand: "#050A24", subInk: "#FEEEE7", hud: "#7F84A3",
    endBg: "#0A1033", logo: "assets/Uddhar_icon.svg",
  },
};
