export default function getUserRoleServerAction(
  poolConfigPath: string,
  authConfigPath: string
) {
  return `
    
"use server";

import { pool } from "${poolConfigPath}";
import { auth } from "${authConfigPath}";

// Get the role from the postgres database based on the UUID in the users table
export const getUserRole = async ({
  tableName = "users",
  columnName = "role",
}: {
  tableName?: string;
  columnName?: string;
} = {}) => {
  const session = await auth();
  if (session) {
    const uuid = session.user.id;

    // Sanitize input
    const uuidRegExp: RegExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
      throw new Error("Invalid UUID");
    }

    const { rows } = await pool.query(\`SELECT \${columnName} FROM \${tableName} WHERE id = $1\`, [
      uuid,
    ]);
    return rows[0]?.[columnName];
  }
};
`;
}
