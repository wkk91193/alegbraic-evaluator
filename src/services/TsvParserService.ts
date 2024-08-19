import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileParser } from '../interfaces/FileParser';

export class TsvParserService implements FileParser {
  async parse(filePath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filePath)
        .pipe(fastCsv.parse({ headers: false, delimiter: '\t' }))
        .on('data', (row: string[]) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}
