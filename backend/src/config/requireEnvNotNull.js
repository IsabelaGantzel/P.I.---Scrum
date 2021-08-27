function requireEnvNotNull(name) {
  const variable = process.env[name];
  if (
    variable === null ||
    variable === undefined ||
    (variable.startsWith("[") && variable.endsWith("]"))
  ) {
    throw new Error(`Environment variable '${name}' can't be null!`);
  } else {
    return variable;
  }
}

module.exports = requireEnvNotNull;
