import { createFile } from '../utils/file';
import { absoluteTime, withPrefix } from '../utils/string';
import path from 'path';
import {
  checkIsAuthenticated,
  clearStaleTokensServerAction,
  emailSignInServerAction,
  getUserNameServerAction,
  getUserRoleServerAction,
  setNameServerAction,
  signOutServerAction,
  unlinkGoogleAccountServerAction,
  getAccountLinkStatusServerAction,
  googleSignInServerAction,
} from '../inject/auth/authUtils/_index';
import { authConfig, env, envs, postgres, route } from '../inject/auth/_index';
import { NextRouterType } from '../enums/router.enum';
export class FileCreator {
  public createAuthFiles(
    answers: any,
    rootDir: string,
    src: boolean,
    extension: string,
    routerType: string
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

    const { authConfigImport, postgresImport } = withPrefix(IMPORT_PREFIX, {
      authConfigImport: `${authPath}/authConfig`,
      postgresImport: `${authPath}/postgres`,
      signInConfigImport: `${authPath}/signInConfig`,
    });

    this.createBaseFiles(
      authUtilsPath,
      authUtilsFiles,
      authConfigImport,
      postgresImport
    );

    if (useGoogleOAuth) {
      this.createGoogleOAuthFiles(
        authUtilsPath,
        authUtilsFiles,
        authConfigImport,
        postgresImport
      );
    }

    this.injectEnvFiles(useGoogleOAuth);

    this.createRouterFile(rootDir, routerType, extension, authConfigImport);

    createFile({
      filePath: authUtilsPath,
      fileName: `authConfig.${extension}`,
      content: authConfig({
        clearStaleTokensServerActionPath: withPrefix(
          './',
          'clearStaleTokensServerAction'
        ),
        setNameServerActionPath: withPrefix('./', 'setNameServerAction'),
        maxAge: absoluteTime(sessionExpirationTime, 's'),
        pages: {
          error: errorPage,
          signIn: signInPage,
          verifyRequest: verifyRequestPage,
        },
        pgPoolPath: withPrefix('./', 'postgres'),
        useGoogleOAuth,
      }),
    });
  }

  private injectEnvFiles(useGoogleOAuth: boolean) {
    createFile({
      filePath: process.cwd(),
      fileName: `.ez-next-auth.env`,
      content: env(envs(useGoogleOAuth)),
    });
  }

  private createBaseFiles(
    authUtilsPath: string,
    authUtilsFiles: any,
    authConfigImport: string,
    postgresImport: string
  ) {
    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.checkIsAuthenticated,
      content: checkIsAuthenticated(authConfigImport),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.getAccountLinkStatusServerAction,
      content: getAccountLinkStatusServerAction(
        authConfigImport,
        postgresImport
      ),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.postgres,
      content: postgres(),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.clearStaleTokensServerAction,
      content: clearStaleTokensServerAction(postgresImport),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.emailSignInServerAction,
      content: emailSignInServerAction(authConfigImport),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.setNameServerAction,
      content: setNameServerAction(authConfigImport, postgresImport),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.getUserNameServerAction,
      content: getUserNameServerAction(authConfigImport),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.getUserRoleServerAction,
      content: getUserRoleServerAction(postgresImport, authConfigImport),
    });

    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.signOutServerAction,
      content: signOutServerAction(authConfigImport),
    });
  }

  private createGoogleOAuthFiles(
    authUtilsPath: string,
    authUtilsFiles: any,
    authConfigImport: string,
    postgresImport: string
  ) {
    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.googleSignInServerAction,
      content: googleSignInServerAction(authConfigImport),
    });
    createFile({
      filePath: authUtilsPath,
      fileName: authUtilsFiles.unlinkGoogleAccountServerAction,
      content: unlinkGoogleAccountServerAction(
        authConfigImport,
        postgresImport
      ),
    });
  }

  private createRouterFile(
    rootDir: string,
    routerType: string,
    extension: string,
    authConfigImport: string
  ) {
    switch (routerType) {
      case NextRouterType.PAGES:
        createFile({
          filePath: rootDir,
          fileName: `api/auth/[...nextauth].${extension}`,
          content: route(authConfigImport),
        });
        break;
      case NextRouterType.APP:
        createFile({
          filePath: rootDir,
          fileName: `api/auth/[...nextauth]/route.${extension}`,
          content: route(authConfigImport),
        });
        break;
    }
  }
}
