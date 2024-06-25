import { createFile } from '../utils/file';
import { withPrefix } from '../utils/string';
import path from 'path';

class FileCreator {
  public createAuthFiles(
    answers: any,
    rootDir: string,
    src: boolean,
    extension: string,
    routerType: string
  ) {
    const { authPath: ap, useGoogleOAuth } = answers;
    const authPath = ap.startsWith('/') ? ap.slice(1) : ap;
    const authUtilsPath = path.join(rootDir, authPath);

    const IMPORT_PREFIX = src ? '@/src/' : '@/';
    const authUtilsFiles = withPrefix(
      `.${extension}`,
      {
        checkIsAuthenticated: 'checkIsAuthenticated',
        clearStaleTokensServerAction: 'clearStaleTokensServerAction',
        emailSignInServerAction: 'emailSignInServerAction',
        getAccountLinkStatusServerAction: 'getAccountLinkStatusServerAction',
        getUserNameServerAction: 'getUserNameServerAction',
        getUserRoleServerAction: 'getUserRoleServerAction',
        googleSignInServerAction: 'googleSignInServerAction',
        setNameServerAction: 'setNameServerAction',
        unlinkGoogleAccountServerAction: 'unlinkGoogleAccountServerAction',
        signOutServerAction: 'signOutServerAction',
        postgres: 'postgres',
      },
      'right'
    );

    this.createBaseFiles(authUtilsPath, authUtilsFiles, IMPORT_PREFIX);

    if (useGoogleOAuth) {
      this.createGoogleOAuthFiles(authUtilsPath, authUtilsFiles, IMPORT_PREFIX);
    }

    this.createRouterFile(
      rootDir,
      routerType,
      extension,
      IMPORT_PREFIX,
      authUtilsFiles
    );
  }

  private createBaseFiles(
    authUtilsPath: string,
    authUtilsFiles: any,
    IMPORT_PREFIX: string
  ) {
    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.checkIsAuthenticated,
      content: `import { checkIsAuthenticated } from '${IMPORT_PREFIX}authConfig';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.getAccountLinkStatusServerAction,
      content: `import { getAccountLinkStatusServerAction } from '${IMPORT_PREFIX}postgres';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.postgres,
      content: `import { postgres } from '${IMPORT_PREFIX}postgres';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.clearStaleTokensServerAction,
      content: `import { clearStaleTokensServerAction } from '${IMPORT_PREFIX}postgres';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.emailSignInServerAction,
      content: `import { emailSignInServerAction } from '${IMPORT_PREFIX}authConfig';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.setNameServerAction,
      content: `import { setNameServerAction } from '${IMPORT_PREFIX}postgres';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.getUserNameServerAction,
      content: `import { getUserNameServerAction } from '${IMPORT_PREFIX}authConfig';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.getUserRoleServerAction,
      content: `import { getUserRoleServerAction } from '${IMPORT_PREFIX}postgres';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.signOutServerAction,
      content: `import { signOutServerAction } from '${IMPORT_PREFIX}authConfig';`,
    });
  }

  private createGoogleOAuthFiles(
    authUtilsPath: string,
    authUtilsFiles: any,
    IMPORT_PREFIX: string
  ) {
    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.googleSignInServerAction,
      content: `import { googleSignInServerAction } from '${IMPORT_PREFIX}authConfig';`,
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.unlinkGoogleAccountServerAction,
      content: `import { unlinkGoogleAccountServerAction } from '${IMPORT_PREFIX}authConfig';`,
    });
  }

  private createRouterFile(
    rootDir: string,
    routerType: string,
    extension: string,
    IMPORT_PREFIX: string,
    authUtilsFiles: any
  ) {
    const routeContent = `import { route } from '${IMPORT_PREFIX}authConfig';`;

    switch (routerType) {
      case 'pages':
        createFile({
          filePath: rootDir,
          fileName: `api/auth/[...nextauth].${extension}`,
          content: routeContent,
        });
        break;
      case 'app':
        createFile({
          filePath: rootDir,
          fileName: `api/auth/[...nextauth]/route.${extension}`,
          content: routeContent,
        });
        break;
    }
  }
}

export { FileCreator };
