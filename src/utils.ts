// src/utils.ts

import * as fs from 'fs';
import path from 'path';

export interface FileConfig {
  inputFilePath: string;
  outputFilePath: string;
  fileType: string;
}

export async function loadConfig(): Promise<FileConfig[]> {
  try {
    const configPath = path.resolve(__dirname, '../config.json');
    const configFile = await fs.promises.readFile(configPath, 'utf-8');
    const files = JSON.parse(configFile)?.files;

    for (const file of files) {
      //Validate config file content
      if (!file.inputFilePath || !file.outputFilePath || !file.fileType) {
        throw new Error('Invalid configuration file');
      }
    }

    return files as FileConfig[];
  } catch (err) {
    throw new Error(`Error loading configuration: ${err}`);
  }
}

export function extractValuesFromHeader(
  header: string[]
): Record<string, number> {
  const variables = 'ABCDEFGHIJK'.split('');
  return header.reduce((acc, value, index) => {
    if (variables[index]) {
      acc[variables[index]] = Number(value);
    }
    return acc;
  }, {} as Record<string, number>);
}
