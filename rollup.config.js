import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";

function getEnvVariables(production) {
  return { "process.env.NODE_ENV": production ? "'production'" : "'development'" };
}

const input = "./lib/index.js";
const external = ['react'];

export default [
  {
    input,
    output: {
      file: "./dist/form-hooks.js",
      format: "cjs",
      globals: {
        react: "React",
      },
    },
    external,
    plugins: [resolve(), filesize(), commonjs()],
  },
  {
    input,
    output: {
      file: "./dist/form-hooks.umd.js",
      format: "umd",
      name: "form-hooks",
      globals: {
        react: "React",
      },
    },
    external,
    plugins: [resolve(), replace(getEnvVariables(true)), uglify(), filesize(), commonjs()],
  },
  {
    input,
    output: {
      file: "./dist/form-hooks.module.js",
      format: "es",
      globals: {
        react: "React",
      },
    },
    external,
    plugins: [resolve(), filesize(), commonjs()],
  }
];
