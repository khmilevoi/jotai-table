import * as fs from "fs";
import { dts } from "rollup-plugin-dts";
import { swc } from "rollup-plugin-swc3";

const plugins = fs.readdirSync("./src/plugins");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
      },
      {
        file: "dist/index.mjs",
        format: "esm",
      },
    ],
    plugins: [swc()],
  },
  ...plugins.map((plugin) => ({
    input: `src/plugins/${plugin}/index.ts`,
    output: [
      {
        file: `dist/plugins/${plugin}/index.cjs`,
        format: "cjs",
      },
      {
        file: `dist/plugins/${plugin}/index.mjs`,
        format: "esm",
      },
    ],
    plugins: [swc()],
  })),
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
  ...plugins.map((plugin) => ({
    input: `src/plugins/${plugin}/index.ts`,
    output: [{ file: `dist/plugins/${plugin}/index.d.ts`, format: "es" }],
    plugins: [dts()],
  })),
];
