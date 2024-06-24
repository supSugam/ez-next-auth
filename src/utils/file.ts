import { accessSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export const doesFileExists = (filePath: string): boolean => {
  try {
    accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

export const createFile = ({
  content,
  fileName,
  filePath,
}: {
  filePath: string;
  content: string;
  fileName: string;
}): void => {
  const fullPath = `${filePath}/${fileName}`;

  // Create directories recursively if they don't exist
  const dir = dirname(fullPath);
  mkdirSync(dir, { recursive: true });

  // Write file content
  writeFileSync(fullPath, content, {
    encoding: 'utf-8',
  });
};
