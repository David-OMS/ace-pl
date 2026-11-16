import { Anton, Archivo_Black, Space_Grotesk } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--ace-font-anton",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--ace-font-archivo-black",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ace-font-space-grotesk",
  display: "swap",
});

/** Class names that register every font variable on the root element. */
export const fontVariables = [anton.variable, archivoBlack.variable, spaceGrotesk.variable].join(
  " ",
);
