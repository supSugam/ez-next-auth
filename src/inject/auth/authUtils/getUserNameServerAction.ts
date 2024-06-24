export default function getUserNameServerAction(authConfigPath: string) {
  return `
    
"use server";

import { auth } from "${authConfigPath}";

export const getUserName = async () => {
  const session = await auth();
  if (session) {
    return session.user.name;
  }
};
`;
}
