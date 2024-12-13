import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import flowbite from "flowbite-react/tailwind";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      flowbite.content()
  ],
  darkMode: 'selector',
  
  daisyui: {
      themes: ["light", "luxury", "disable", {
          bumblebee: {
              ...require("daisyui/src/theming/themes"),
              baseContent: "#dca44c"
          }
      }],
  },
  plugins: [
      require("daisyui"),
      flowbite.plugin(),
  ],
};



export default config;
