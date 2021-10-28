import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";
dotenv.config();

export default {
  plugins: [
    replace({
      "process.env.INFURA_PROJECT_ID": `"${process.env.INFURA_PROJECT_ID}"`,
      preventAssignment: true,
    }),
  ],
};
