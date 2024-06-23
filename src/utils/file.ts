import { accessSync, writeFileSync } from 'fs';

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
  writeFileSync(`${filePath}/${fileName}`, content, {
    encoding: 'utf-8',
  });
};
