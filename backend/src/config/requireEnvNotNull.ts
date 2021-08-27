export function requireEnvNotNull(name: string) {
  const variable = process.env[name];
  if (variable === null || variable === undefined) {
    throw new Error(`Environment variable '${name}' can't be null!`);
  } else {
    return variable;
  }
}
