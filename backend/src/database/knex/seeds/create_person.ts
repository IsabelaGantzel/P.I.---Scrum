import { Knex } from "knex";
import { ADMIN_PASSWORD } from "../../../config";
import * as passwordManager from "../../../services/passwordManager";

export async function seed(knex: Knex) {
  // Only the admin can add new users
  const password = await passwordManager.hashPassword(ADMIN_PASSWORD);
  await knex("persons").insert([{ user: "admin", password }]);
}
