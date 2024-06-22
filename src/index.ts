import { program } from 'commander';
import inquirer from 'inquirer';
import { isNextJsProject } from './utils/validation';
const packageJson = require('../package.json');

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.description);

const isValidProject = isNextJsProject();

console.log('isValidProject', isValidProject);
