export default function googleSignInServerAction(authConfigPath: string) {
  return `
    
"use server";

import { signIn } from "${authConfigPath}";

export const handleGoogleSignIn = async (redirectTo:string="/dashboard") => {
  try {
    await signIn("google", { redirectTo });
  } catch (error) {
    throw error;
  }
};
`;
}
