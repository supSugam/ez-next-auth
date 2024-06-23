export default function env(envs: Record<string, string | undefined>) {
  let envString: string = '';

  for (const key in envs) {
    envString += `${key}='${envs[key]}';\n`;
  }
  return envString;
}
