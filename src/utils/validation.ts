import { readdirSync } from 'fs';
import { NextRouterType } from '../enums/router.enum';
import { cwd } from 'process';
import { ProjectLanguage } from '../enums/language.enum';
import { doesFileExists } from './file';

export const isNextJsProject = (projectPath?: string): boolean => {
  const nextJsConfigExtensions: string[] = ['.js', '.mjs'];

  const nextJsConfigPath = projectPath
    ? `${projectPath}/next.config`
    : `${process.cwd()}/next.config`;

  console.log('nextJsConfigPath', nextJsConfigPath);
  const hasNextJsConfig = nextJsConfigExtensions.some((ext) => {
    try {
      require.resolve(nextJsConfigPath + ext);
      return true;
    } catch (error) {
      return false;
    }
  });

  return hasNextJsConfig && isPackageInstalled('next');
};

export const isPackageInstalled = (
  packageName: string,
  dev: boolean = false
): boolean => {
  return !!require(`${cwd()}/package.json`)[
    `${dev ? 'devDependencies' : 'dependencies'}`
  ][packageName];
};

export interface RouterTypePayload {
  routerType: NextRouterType;
  src?: boolean;
  path: string;
}
export const getRouterType = (projectRoot?: string): RouterTypePayload => {
  // Valid Router Type Cases
  // -> /pages or src/pages
  // -> /app or src/app

  const projectPath = projectRoot ?? cwd();
  const paths = [
    `${projectPath}/pages`,
    `${projectPath}/app`,
    `${projectPath}/src/pages`,
    `${projectPath}/src/app`,
  ];

  for (const path of paths) {
    try {
      readdirSync(path);
      const payload = {
        src: path.includes('src'),
      } as RouterTypePayload;
      if (path.includes(NextRouterType.PAGES)) {
        payload.routerType = NextRouterType.PAGES;
      }
      if (path.includes(NextRouterType.APP)) {
        payload.routerType = NextRouterType.APP;
      }
      payload.path = path;
      return payload;
    } catch (error) {
      continue;
    }
  }

  throw new Error('Invalid Router Type');
};

export const getProjectLanguage = (projectRoot?: string): ProjectLanguage => {
  const projectPath = projectRoot ?? cwd();
  return doesFileExists(`${projectPath}/tsconfig.json`) &&
    isPackageInstalled('typescript', true)
    ? ProjectLanguage.TYPESCRIPT
    : ProjectLanguage.JAVASCRIPT;
};
