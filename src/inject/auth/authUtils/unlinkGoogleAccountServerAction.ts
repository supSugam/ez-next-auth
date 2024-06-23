export default function unlinkGoogleAccount({
  authConfigPath,
  poolConfigPath,
}: {
  authConfigPath: string;
  poolConfigPath: string;
}) {
  return `
    
"use server";

import { auth } from "${authConfigPath}";
import { pool } from "${poolConfigPath}";

// Deletes the user's Google account record from the database
export const unlinkGoogleAccount = async ({
  tableName = "accounts",
  columnName = "userId",
}: {
  tableName?: string;
  columnName?: string;
} = {}) => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const uuid: string = session.user.id;

  // Sanitize input
  const uuidRegExp: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
    throw new Error("Invalid UUID");
  }

  // Remove the Google account from the database
  try {
    await pool.query(
      \`DELETE FROM \${tableName} WHERE provider = 'google' AND "\${columnName}" = $1\`,
      [uuid]
    );
    return true;
  } catch (error) {
    console.error("Failed to unlink Google account:", error);
    throw error; // rethrow the error to maintain consistency with original behavior
  }
};
`;
}
