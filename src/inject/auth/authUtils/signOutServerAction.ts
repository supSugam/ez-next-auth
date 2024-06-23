export default function handleSignOut(authConfigPath: string) {
  return `
    
"use server";

import { signOut } from "${authConfigPath}";

export const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
};
`;
}
