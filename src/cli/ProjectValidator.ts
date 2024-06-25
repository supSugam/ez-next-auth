import {
  getProjectLanguage,
  getRouterType,
  isNextJsProject,
  isError,
} from '../utils/validation';

class ProjectValidator {
  public isNextJsProject(): boolean {
    return isNextJsProject();
  }

  public getRouterType() {
    return getRouterType();
  }

  public handleValidationError(error: unknown) {
    isError(error, (err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
  }

  public getProjectLanguage() {
    return getProjectLanguage();
  }
}

export { ProjectValidator };
