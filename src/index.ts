import { program } from 'commander';
import inquirer from 'inquirer';
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
const packageJson = require('../package.json');

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description);

const isValidProject = isNextJsProject();
let router: RouterTypePayload;
try {
  router = getRouterType();
} catch (error: unknown) {
  isError(error, (err) => {
    console.error(err.message);
    process.exit(1);
  });
}

const language = getProjectLanguage();

inquirer
  .prompt([
    // Session Expiration Time (maxAge) ->  1d 7d 30d 90d 180d 365d
    {
      type: 'list',
      name: 'sessionExpirationTime',
      message: 'Session Expiration Time (maxAge)',
      choices: ['1d', '7d', '30d', '90d', '180d', '365d'],
      default: '30d',
    },
    // Use Google OAuth?
    {
      type: 'confirm',
      name: 'useGoogleOAuth',
      message: 'Use Google OAuth?',
      default: false,
    },

    // Ask for the path to store auth utilities (lib/auth) by default
    {
      type: 'input',
      name: 'authPath',
      message: 'Path to store Auth utilities',
      default: 'lib/auth',
    },
  ])
  .then((answers) => {
    const { routerType, path: rootDir, src } = router;

    const authUtilsPath = path.join(rootDir, answers.authPath);

    switch (routerType) {
      case NextRouterType.PAGES:
        createFile({
          filePath: rootDir,
          fileName: `api/auth/[...nextauth].${
            language === ProjectLanguage.TYPESCRIPT ? 'ts' : 'js'
          }`,
          content: `import NextAuth from 'next-auth'`,
        });
        break;
      case NextRouterType.APP:
        createFile({
          filePath: rootDir,
          fileName: `api/auth/[...nextauth]/route.${
            language === ProjectLanguage.TYPESCRIPT ? 'ts' : 'js'
          }`,
          content: `import NextAuth from 'next-auth'`,
        });
        break;
    }
  });
