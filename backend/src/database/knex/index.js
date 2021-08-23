const { knex } = require("knex");
const instance = require("./instance");
const config = require("./config");

module.exports = instance(knex(config));
