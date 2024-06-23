export default function checkIsAuthenticated(signInConfigPath: string) {
  return `
    
"use server";

import { signIn } from "${signInConfigPath}";

export const handleEmailSignIn = async (email: string, callbackUrl: string="/dashboard") => {
  try {
    await signIn("nodemailer", { email, callbackUrl });
  } catch (error) {
    throw error;
  }
};
`;
}
