import dotenv from "dotenv";
import path from "path";
import { requireEnvNotNull } from "./requireEnvNotNull";

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

export const PORT = requireEnvNotNull("PORT");
export const ADMIN_PASSWORD = requireEnvNotNull("ADMIN_PASSWORD");
