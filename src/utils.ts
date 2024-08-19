// src/utils.ts

import { promises as fs } from 'fs';
import path from 'path';

export interface FileConfig {
  inputFilePath: string;
  outputFilePath: string;
  fileType: string;
}

export async function loadConfig(): Promise<FileConfig[]> {
  const configPath = path.resolve(__dirname, '../config.json');
  const configFile = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(configFile);
  return config.files as FileConfig[];
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
