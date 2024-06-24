export default function clearStaleTokensServerAction(postgresPath: string) {
  return `
"use server";

import { pool } from "${postgresPath}";

export const clearStaleTokens = async (tableName:string="verification_token") => {
    try {
        await pool.query(\`DELETE FROM \${tableName} WHERE expires < NOW();\`);
    } catch (error) {
        throw error;
    }
};
    `;
}
