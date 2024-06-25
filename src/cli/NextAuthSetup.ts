import { program } from 'commander';
import prompts from 'prompts';
import { ConfigManager } from './ConfigManager';
import { ProjectValidator } from './ProjectValidator';
import { FileCreator } from './FileCreator';
import packageJson from '../../package.json';

export class NextAuthSetup {
  private configManager: ConfigManager;
  private projectValidator: ProjectValidator;
  private fileCreator: FileCreator;

  constructor() {
    this.configManager = new ConfigManager();
    this.projectValidator = new ProjectValidator();
    this.fileCreator = new FileCreator();
  }

  public async initialize() {
    program
      .name(packageJson.name)
      .version(packageJson.version)
      .description(packageJson.description);

    const isValidProject = this.projectValidator.isNextJsProject();
    let router;
    try {
      router = this.projectValidator.getRouterType();
    } catch (error) {
      this.projectValidator.handleValidationError(error);
    }

    if (!isValidProject) {
      console.error('Error: Not a Next.js project');
      process.exit(1);
    }

    if (!router) {
      console.error('Error: Router type not found');
      process.exit(1);
    }

    const language = this.projectValidator.getProjectLanguage();
    const extension = language === 'typescript' ? 'ts' : 'js';
    const { routerType, path: rootDir, src } = router;

    const answers = await this.promptUser();

    this.configManager.setupConfig(answers, rootDir, src, extension);
    this.fileCreator.createAuthFiles(
      answers,
      rootDir,
      src,
      extension,
      routerType
    );

    console.log(`
      Next Auth Setup Complete, Do not forget to:
      - Copy the .ez-next-auth.env contents to your actual .env file.
      - Update the .env file with the correct values.
      - Ensure the database connection is working.
  
      Planned Features:
      - Add more provider for OAuth.
      - Support MySQL and other databases.
      - Support Session Strategy.
      - Better CLI UX.
  
      ※ ez-next-auth by @supSugam, Open to contributions at https://github.com/supSugam/ez-next-auth
      
      `);
  }

  private async promptUser() {
    return prompts([
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
        initial: 2,
      },
      {
        type: 'confirm',
        name: 'useGoogleOAuth',
        message: 'Use Google OAuth?',
        initial: true,
      },
      {
        type: 'text',
        name: 'authPath',
        message: 'Path to store Auth utilities',
        initial: 'lib/auth',
      },
      {
        type: 'text',
        name: 'signInPage',
        message: 'Sign In Page Path',
        initial: '/auth/signin',
      },
      {
        type: 'text',
        name: 'verifyRequestPage',
        message: 'Verify Request Page Path',
        initial: '/auth/verify-request',
      },
      {
        type: 'text',
        name: 'errorPage',
        message: 'Error Page Path',
        initial: '/auth/error',
      },
    ]);
  }
}
