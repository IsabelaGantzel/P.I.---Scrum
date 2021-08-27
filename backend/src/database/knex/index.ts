import { knex } from "knex";
import { instance } from "./instance";
import config from "./config";

export const db = instance(knex(config));
