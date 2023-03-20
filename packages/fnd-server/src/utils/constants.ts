import dotenv from "dotenv";

const envPath = process.env.NODE_ENV !== "production" ? ".env.development" : ".env";
// setup environment
dotenv.config({
  path: envPath,
});
export const { INFURA_PROJECT_ID } = process.env;

if (!INFURA_PROJECT_ID) {
  throw new Error("Set INFURA_PROJECT_ID in env variables");
}
