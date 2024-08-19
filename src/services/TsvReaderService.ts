import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import { FileReader } from '../interfaces/FileReader';

export class TsvReaderService implements FileReader {
  async read(filePath: string): Promise<string[][]> {
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
