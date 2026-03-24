/**
 * POSTCSS CONFIGURATION — AI Tattoo Generator
 *
 * Uses the Tailwind CSS v4 PostCSS plugin. This is the new approach
 * for Tailwind v4 where configuration happens in CSS (@theme) rather
 * than in a separate tailwind.config.ts file. The @tailwindcss/postcss
 * plugin handles all the compilation from Tailwind utilities to actual CSS.
 *
 * This pattern matches our saas-clone-template reference implementation.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
