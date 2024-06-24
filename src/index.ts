import { program } from 'commander';
import {
  getProjectLanguage,
  getRouterType,
  isNextJsProject,
  type RouterTypePayload,
} from './utils/validation';
import { isError } from './utils/safe';
import { NextRouterType } from './enums/router.enum';
import { createFile } from './utils/file';
import { ProjectLanguage } from './enums/language.enum';
import path from 'path';
import route from './inject/auth/route';
import { withPrefix } from './utils/string';
import authConfig from './inject/auth/authConfig';
import checkIsAuthenticated from './inject/auth/authUtils/checkIsAuthenticated';
import getAccountLinkStatus from './inject/auth/authUtils/getAccountLinkStatusServerAction';
import postgres from './inject/auth/postgres';
import clearStaleTokensServerAction from './inject/auth/authUtils/clearStaleTokensServerAction';
import emailSignInServerAction from './inject/auth/authUtils/emailSignInServerAction';
import googleSignInServerAction from './inject/auth/authUtils/googleSignInServerAction';
import setNameServerAction from './inject/auth/authUtils/setNameServerAction';
import getUserRoleServerAction from './inject/auth/authUtils/getUserRoleServerAction';
import getUserNameServerAction from './inject/auth/authUtils/getUserNameServerAction';
import unlinkGoogleAccountServerAction from './inject/auth/authUtils/unlinkGoogleAccountServerAction';
import signOutServerAction from './inject/auth/authUtils/signOutServerAction';
import env, { envs } from './inject/env';
import prompts from 'prompts';
const packageJson = require('../package.json');

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description);

const isValidProject = isNextJsProject();
let router: RouterTypePayload | undefined;
try {
  router = getRouterType();
} catch (error: unknown) {
  isError(error, (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}

if (!isValidProject) {
  console.error('Error: Not a Next.js project');
  process.exit(1);
}

if (!router) {
  console.error('Error: Router type not found');
  process.exit(1);
}

const language = getProjectLanguage();
const extension = language === ProjectLanguage.TYPESCRIPT ? 'ts' : 'js';
const { routerType, path: rootDir, src } = router;

(async () => {
  const answers = await prompts([
    {
      type: 'select',
      name: 'sessionExpirationTime',
      message: 'Session Expiration Time (maxAge)',
      choices: [
        { title: '1 day', value: '1d' },
        { title: '7 days', value: '7d' },
        { title: '30 days', value: '30d' },
        { title: '90 days', value: '90d' },
        { title: '180 days', value: '180d' },
        { title: '365 days', value: '365d' },
      ],
      initial: 2, // Default to '30d'
    },
    {
      type: 'confirm',
      name: 'useGoogleOAuth',
      message: 'Use Google OAuth?',
      initial: false, // Default to false
    },
    {
      type: 'text',
      name: 'authPath',
      message: 'Path to store Auth utilities',
      initial: 'lib/auth', // Default path
    },
    {
      type: 'text',
      name: 'signInPage',
      message: 'Sign In Page Path',
      initial: '/auth/signin', // Default path
    },
    {
      type: 'text',
      name: 'verifyRequestPage',
      message: 'Verify Request Page Path',
      initial: '/auth/verify-request', // Default path
    },
    {
      type: 'text',
      name: 'errorPage',
      message: 'Error Page Path',
      initial: '/auth/error', // Default path
    },
  ]);

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

  // "@/src/lib/auth/authConfig
  const { authConfigImport, postgresImport } = withPrefix(IMPORT_PREFIX, {
    authConfigImport: `${authPath}/authConfig`,
    postgresImport: `${authPath}/postgres`,
    signInConfigImport: `${authPath}/signInConfig`,
  });

  const authUtilsFiles = withPrefix(
    `./`,
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
    'left'
  );

  createFile({
    filePath: authUtilsPath,
    fileName: authUtilsFiles.checkIsAuthenticated,
    content: checkIsAuthenticated(authConfigImport),
  });

  createFile({
    filePath: authUtilsPath,
    fileName: authUtilsFiles.getAccountLinkStatusServerAction,
    content: getAccountLinkStatus(authConfigImport, postgresImport),
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

  if (useGoogleOAuth) {
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

  createFile({
    filePath: authUtilsPath,
    fileName: `authConfig.${extension}`,
    content: authConfig({
      clearStaleTokensServerActionPath:
        authUtilsFiles.clearStaleTokensServerAction,
      setNameServerActionPath: authUtilsFiles.setNameServerAction,
      maxAge: sessionExpirationTime,
      pages: {
        error: errorPage,
        signIn: signInPage,
        verifyRequest: verifyRequestPage,
      },
      pgPoolPath: authUtilsFiles.postgres,
      useGoogleOAuth,
    }),
  });

  createFile({
    filePath: rootDir,
    fileName: `.ez-next-auth.env`,
    content: env(envs(useGoogleOAuth)),
  });

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

  console.log('Auth utilities created successfully');
})();
