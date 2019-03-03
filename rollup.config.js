import resolve from "rollup-plugin-node-resolve";

export default {
  input: ["src/pr-monitor-app.js"],
  output: {
    file: "public/index.js",
    format: "es"
  },
  plugins: [resolve()]
};
