import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileParser } from '../interfaces/FileParser';

export class CsvParserService implements FileParser {
  parse(filepath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filepath)
        .pipe(fastCsv.parse({ headers: false, delimiter: ',' }))
        .on('data', (row: string[]) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }
}
