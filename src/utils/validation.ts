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

  const hasNextJsInPackageJson = !!require(`${process.cwd()}/package.json`)
    .dependencies['next'];

  return hasNextJsConfig && hasNextJsInPackageJson;
};

export const getRouterType = (routerPath: string): NextRouterType => {
  // TODO: Implement this function
};
