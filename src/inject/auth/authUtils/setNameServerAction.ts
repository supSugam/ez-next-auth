export default function setName({
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

export const setName = async ({
  name,
  columnName = "name",
  tableName = "users",
}: {
  name: string;
  columnName?: string;
  tableName?: string;
}) => {
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
  name = name.trim();

  // Update the user's name in the database
  await updateNameInDatabase(name, columnName, tableName, uuid);

  return true;
};

const updateNameInDatabase = async (
  name: string,
  columnName: string,
  tableName: string,
  uuid: string
) => {
  await pool.query(\`UPDATE \${tableName} SET \${columnName} = $1 WHERE id = $2\`, [
    name,
    uuid,
  ]);
};
`;
}
