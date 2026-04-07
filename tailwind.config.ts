import type { Config } from "tailwindcss";

// En Tailwind v4, les tokens sont définis dans globals.css via @theme inline.
// Ce fichier ne sert qu'à déclarer les fichiers à scanner.
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
} satisfies Config;
