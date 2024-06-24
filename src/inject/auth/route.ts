export default function route(authConfigPath: string) {
  return `
import { handlers } from "${authConfigPath}";

export const { GET, POST } = handlers;
    `;
}
