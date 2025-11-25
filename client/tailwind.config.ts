import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // @ts-ignore
  daisyui: {
    themes: ["light", "dark", "corporate"], // bạn có thể thêm "cupcake", "night", "wireframe"...
  },
};
export default config;
