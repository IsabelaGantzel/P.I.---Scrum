import { Knex } from "knex";

export async function seed(knex: Knex) {
  await knex("stages").insert([
    { name: "Started" },
    { name: "Doing" },
    { name: "Testing" },
    { name: "Reviewing" },
    { name: "Complete" },
  ]);
}
