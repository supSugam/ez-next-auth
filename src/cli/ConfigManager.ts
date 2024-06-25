import path from 'path';
import { absoluteTime, withPrefix } from '../utils/string';
import { createFile } from '../utils/file';

export class ConfigManager {
  public setupConfig(
    answers: any,
    rootDir: string,
    src: boolean,
    extension: string
  ) {
    const {
      sessionExpirationTime,
      useGoogleOAuth,
      authPath: ap,
      verifyRequestPage,
      errorPage,
      signInPage,
    } = answers;

    const authPath = ap.startsWith('/') ? ap.slice(1) : ap;
    const authUtilsPath = path.join(rootDir, authPath);
    const IMPORT_PREFIX = src ? '@/src/' : '@/';
    const { authConfigImport, postgresImport } = withPrefix(IMPORT_PREFIX, {
      authConfigImport: `${authPath}/authConfig`,
      postgresImport: `${authPath}/postgres`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: `authConfig.${extension}`,
      content: this.generateAuthConfig({
        sessionExpirationTime,
        useGoogleOAuth,
        authPath,
        verifyRequestPage,
        errorPage,
        signInPage,
        authConfigImport,
        postgresImport,
      }),
    });
  }

  private generateAuthConfig(params: any): string {
    const {
      sessionExpirationTime,
      useGoogleOAuth,
      authPath,
      verifyRequestPage,
      errorPage,
      signInPage,
      authConfigImport,
      postgresImport,
    } = params;

    return `
      import { authConfig } from '${authConfigImport}';
      import { postgres } from '${postgresImport}';

      export default authConfig({
        clearStaleTokensServerActionPath: './clearStaleTokensServerAction',
        setNameServerActionPath: './setNameServerAction',
        maxAge: ${absoluteTime(sessionExpirationTime, 's')},
        pages: {
          error: '${errorPage}',
          signIn: '${signInPage}',
          verifyRequest: '${verifyRequestPage}',
        },
        pgPoolPath: './postgres',
        useGoogleOAuth: ${useGoogleOAuth},
      });
    `;
  }
}
