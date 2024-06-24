export default function checkIsAuthenticated(authConfigPath: string) {
  return `
"use server";

import { auth } from "${authConfigPath}";

export const checkIsAuthenticated = async () => {
  const session = await auth();
  if (session) {
    return true;
  }
  return false;
};
`;
}
