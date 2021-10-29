import replace from "@rollup/plugin-replace";

export default {
  plugins: [
    replace({
      "process.env.INFURA_PROJECT_ID": `"${process.env.INFURA_PROJECT_ID}"`,
      preventAssignment: true,
    }),
  ],
};
