import path from 'node:path';
import { readFile } from 'node:fs/promises';

export async function getContentsFromFile(filePath: string) {
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const content = fileContent.split('\n');

    return content;
  } catch (_error) {
    throw new Error(`Error, file ${filePath} not found`);
  }
}
