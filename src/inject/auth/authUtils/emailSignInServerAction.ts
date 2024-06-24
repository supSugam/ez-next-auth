export default function emailSignInServerAction(signInConfigPath: string) {
  return `
    
"use server";

import { signIn } from "${signInConfigPath}";

export const handleEmailSignIn = async (email: string, callbackUrl: string="/") => {
  try {
    await signIn("nodemailer", { email, callbackUrl });
  } catch (error) {
    throw error;
  }
};
`;
}
